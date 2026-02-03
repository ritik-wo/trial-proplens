"use client";
import * as React from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Send, Mic, ThumbsUp, ThumbsDown, Copy as CopyIcon, Edit3, Save, X, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { TypedPitch } from '@/components/blocks/TypedPitch';
import { apiClient } from '@/lib/api';

import projectsData from '@/lib/projects.json';
import { ShareMenu } from '@/components/blocks/ShareMenu';
import { useSpeechRecognition } from '@/lib/hooks/useSpeechRecognition';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

type Option = { value: string; label: string };

// Build project options from seeded JSON file
const PROJECTS: Option[] = (projectsData as any[]).map((p: any) => ({
  value: String(p._id ?? ''),
  label: String(p.name ?? ''),
})).filter(p => p.value && p.label);

const PITCH_LENGTH: Option[] = [
  { value: 'short', label: 'Message' },
  { value: 'lengthy', label: 'Email' },
  { value: 'Bulleted', label: 'Bulleted' },
];

const PITCH_STAGE: Option[] = [
  { value: 'enquiry', label: 'Enquiry' },
  { value: 'consideratio', label: 'Consideration' },
  { value: 'purchase', label: 'Purchase' },
];

type FormValues = { project: string; length: string; stage: string; customer: string; notes: string };

export default function Page() {

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: {
      project: PROJECTS[0].value,
      length: PITCH_LENGTH[0].value,
      stage: PITCH_STAGE[0].value,
      customer: '',
      notes: ''
    }
  });

  const [displayName, setDisplayName] = React.useState<string>('there');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogLang, setDialogLang] = React.useState<'en' | 'ar' | 'hi'>('en');
  const [pitch, setPitch] = React.useState<string>('');
  const [typingKey, setTypingKey] = React.useState<number>(0);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedPitch, setEditedPitch] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const [bodyMinHeight, setBodyMinHeight] = React.useState<number | null>(null);
  const pitchBoxRef = React.useRef<HTMLDivElement | null>(null);
  const [pitchBoxMinHeight, setPitchBoxMinHeight] = React.useState<number | null>(null);
  const editableRef = React.useRef<HTMLDivElement | null>(null);
  // Voice input for notes: keep text in textarea, do not auto-send
  const { isListening, toggle: toggleMic } = useSpeechRecognition({
    lang: 'en-US',
    interim: true,
    onInterim: (text) => setValue('notes', text, { shouldDirty: true }),
    onFinal: (text) => setValue('notes', text, { shouldDirty: true }),
  });

  const authUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '67fe0defb1bb16718f027aab' : '67fe0defb1bb16718f027aab';
  const [submitting, setSubmitting] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('Generating...');

  React.useEffect(() => {
    if (!submitting) {
      setLoadingText('Generating...');
      return;
    }

    const messages = [
      "Gathering your preferences…",
      "Looking up the project information…",
      "Crafting a personalized message…",
      "Almost there…"
    ];

    let index = 0;
    setLoadingText(messages[0]);

    const interval = setInterval(() => {
      index++;
      if (index < messages.length) {
        setLoadingText(messages[index]);
      } else {
        clearInterval(interval);
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [submitting]);


  async function handleCopy() {
    try { await navigator.clipboard.writeText(pitch); } catch { }
  }

  React.useEffect(() => {
    const fromLS = (localStorage.getItem('userDisplayName') || '').trim();
    if (fromLS) setDisplayName(fromLS.split(' ')[0]);
  }, []);

  React.useEffect(() => {
    if (isEditing) {
      const el = editableRef.current;
      if (el) {
        el.innerText = pitch;
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        el.focus();
        setEditedPitch(pitch);
      }
    }
  }, [isEditing, pitch]);

  async function onSubmit(values: FormValues) {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Map to API's required casing: type, stage should be labels; project_id is value; customer_name and query from form
      const typeLabel = PITCH_LENGTH.find(p => p.value === values.length)?.label || values.length;
      const stageLabel = PITCH_STAGE.find(s => s.value === values.stage)?.label || values.stage;
      const chatId = (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      const params = new URLSearchParams();
      if (authUserId) params.append('user_id', authUserId);
      params.append('query', (values.notes || '').trim() || '');
      params.append('type', typeLabel);
      params.append('customer_name', values.customer || '');
      params.append('stage', stageLabel);
      // Ensure we always send the project's _id (not name)
      const selectedProject = (projectsData as any[]).find((p: any) => String(p._id) === values.project || String(p.name) === values.project);
      const projectIdToSend = selectedProject ? String(selectedProject._id) : values.project;
      params.append('project_id', projectIdToSend);
      params.append('chat_id', chatId);

      const { data } = await apiClient.post<any>('/api/pitch/sales_pitch_using_query', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      let text: string = '';
      if (typeof data === 'string') {
        // Try to parse JSON string to extract pitch, else use as-is
        try {
          const parsed = JSON.parse(data);
          text = typeof parsed?.pitch === 'string' ? parsed.pitch : data;
        } catch {
          text = data;
        }
      } else if (data && typeof data === 'object') {
        text = typeof data.pitch === 'string' ? data.pitch : JSON.stringify(data);
      } else {
        text = String(data ?? '');
      }
      setPitch(text);
      setTypingKey(prev => prev + 1);
      setDialogOpen(true);
      setIsEditing(false);
      const el = bodyRef.current;
      if (el) setBodyMinHeight(el.getBoundingClientRect().height);
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || 'Failed to generate pitch';
      setPitch(String(msg));
      setTypingKey(prev => prev + 1);
      setDialogOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-[calc(100dvh-var(--app-header-offset,56px))] md:min-h-screen grid place-items-center px-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-2 md:gap-3 w-full max-w-[920px]">
        <div className="max-w-[760px] mx-auto text-center mb-3 md:mb-5">
          <h1 className="h-font text-[20px] md:text-[22px] font-normal tracking-[-0.01em] text-[--color-neutral-900] m-0">
            Hi {displayName}! Let's create a personalized sales message for your property buyer
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="card-base bg-[--color-surface] p-5 md:p-6 w-full max-w-[880px] mx-auto" style={{ borderRadius: 'calc(var(--radius-card) + 4px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
              <div className="space-y-1.5">
                <div className="b-font text-sm font-semibold text-[--color-neutral-900]">Project name</div>
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: 'Project is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-9 bg-[--color-neutral-100] border-[--color-neutral-200] text-[--color-neutral-900] ${errors.project ? 'border-[--color-danger]' : ''}`}>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 overflow-auto">
                        {PROJECTS.map(p => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.project && <div className="text-[--color-danger] text-xs">{errors.project.message}</div>}
              </div>

              <div className="space-y-1.5">
                <div className="b-font text-sm font-semibold text-[--color-neutral-900]">Pitch Type</div>
                <Controller
                  name="length"
                  control={control}
                  rules={{ required: 'Pitch Type is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-9 bg-[--color-neutral-100] border-[--color-neutral-200] text-[--color-neutral-900] ${errors.length ? 'border-[--color-danger]' : ''}`}>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 overflow-auto">
                        {PITCH_LENGTH.map(p => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.length && <div className="text-[--color-danger] text-xs">{errors.length.message}</div>}
              </div>

              <div className="space-y-1.5">
                <div className="b-font text-sm font-semibold text-[--color-neutral-900]">Pitch Stage</div>
                <Controller
                  name="stage"
                  control={control}
                  rules={{ required: 'Pitch Stage is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-9 bg-[--color-neutral-100] border-[--color-neutral-200] text-[--color-neutral-900] ${errors.stage ? 'border-[--color-danger]' : ''}`}>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72 overflow-auto">
                        {PITCH_STAGE.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.stage && <div className="text-[--color-danger] text-xs">{errors.stage.message}</div>}
              </div>

              <div className="space-y-1">
                <div className="b-font text-sm font-semibold text-[--color-neutral-900]">Customer name</div>
                <Input
                  placeholder="Enter customer name"
                  className={`h-9 rounded-md bg-[--color-neutral-100] border border-[--color-neutral-200] text-[--color-neutral-900] ${errors.customer ? 'border-[--color-danger]' : ''}`}
                  {...register('customer', { required: 'Customer name is required' })}
                />
                {errors.customer && <div className="text-[--color-danger] text-xs">{errors.customer.message}</div>}
              </div>

              <div className="md:col-span-4 space-y-1">
                <div className="b-font text-sm font-semibold text-[--color-neutral-900]">Additional instructions</div>
                <div className="relative">
                  <Textarea
                    placeholder="Emphasize on investment potential"
                    rows={3}
                    className={`w-full rounded-md bg-[--color-neutral-200] border border-[--color-neutral-200] pr-10 resize-none !focus-visible:outline-2 !focus-visible:outline-[--color-neutral-400] focus:border-[--color-neutral-400] ${errors.notes ? 'border-[--color-danger]' : ''}`}
                    {...register('notes', { required: 'Please add some instructions' })}
                  />
                  <button
                    type="button"
                    aria-label="Voice input"
                    aria-pressed={isListening}
                    onClick={toggleMic}
                    className={`absolute right-3 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors border-0 ${isListening ? 'bg-[--color-primary]/10' : 'hover:bg-[--color-neutral-300]'}`}
                  >
                    <Mic className="w-4 h-4" color={isListening ? 'var(--color-primary)' : 'var(--color-neutral-700)'} strokeWidth={2.2} />
                  </button>
                </div>
                {errors.notes && <div className="text-[--color-danger] text-xs">{errors.notes.message}</div>}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[560px] mx-auto mt-4">
            <Button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={`w-full rounded-full text-white py-3 ${submitting ? 'opacity-80 cursor-not-allowed bg-black' : 'hover:opacity-95 bg-black'}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {loadingText}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Personalized Pitch
                </>
              )}
            </Button>
          </div>
        </form>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              // Reset TypedPitch and related UI state when dialog closes
              setPitch('');
              setTypingKey(0);
              setIsEditing(false);
              setEditedPitch('');
              setIsTyping(false);
              setBodyMinHeight(null);
              setPitchBoxMinHeight(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personalized Sales Pitch</DialogTitle>
              <div className="flex items-center gap-2">
                {/* <div className="b-font text-sm text-[--color-neutral-700] hidden md:block">Language</div>
                <Select value={dialogLang} onValueChange={(v) => setDialogLang(v as any)}>
                  <SelectTrigger className="h-8 min-w-[120px] bg-[--color-neutral-100] border-[--color-neutral-200]">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                  </SelectContent>
                </Select> */}
                <DialogClose asChild>
                  <Button variant="outline" size="sm">Close</Button>
                </DialogClose>
              </div>
            </DialogHeader>
            <DialogBody className="space-y-4" ref={bodyRef as any} style={bodyMinHeight ? { minHeight: bodyMinHeight } : undefined}>
              <div
                ref={pitchBoxRef as any}
                className="rounded-lg bg-[--color-neutral-100] border border-[--color-neutral-200] p-5 flex flex-col"
                style={pitchBoxMinHeight ? { minHeight: pitchBoxMinHeight } : undefined}
              >
                <div className={isEditing ? 'hidden' : 'block'}>
                  {/* <TypedPitch text={pitch} restartKey={typingKey} onTypingChange={setIsTyping} containerRef={bodyRef as any} /> */}
                  <div
                    className="chat-markdown text-[14px]"
                    dangerouslySetInnerHTML={{ __html: marked.parse(pitch) as string }}
                  />
                </div>
                <div className={isEditing ? 'block' : 'hidden'}>
                  <div
                    ref={editableRef as any}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={() => setEditedPitch(editableRef.current?.innerText || '')}
                    className="w-full bg-white border border-[--color-neutral-300] rounded-md p-3 whitespace-pre-wrap break-words outline-none focus:ring-2 focus:ring-[--color-primary]"
                    aria-label="Edit pitch"
                    role="textbox"
                  />
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    className="rounded-full h-9 px-4"
                    onClick={() => { setPitch(editedPitch); setIsEditing(false); }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full h-9 px-4"
                    onClick={() => { setIsEditing(false); }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Tooltip.Provider delayDuration={200}>
                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <button type="button" aria-label="Like" className="h-8 w-8 btn-base border border-[--color-neutral-300] bg-white text-[--color-neutral-900] hover:bg-[--color-neutral-50]">
                        <ThumbsUp className="w-4 h-4 text-[--color-neutral-700]" strokeWidth={2.2} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={6} className="px-2 py-1 rounded-md bg-[--color-neutral-900] text-white text-xs shadow">
                      Like
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <button type="button" aria-label="Dislike" className="h-8 w-8 btn-base border border-[--color-neutral-300] bg-white text-[--color-neutral-900] hover:bg-[--color-neutral-50]">
                        <ThumbsDown className="w-4 h-4 text-[--color-neutral-700]" strokeWidth={2.2} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={6} className="px-2 py-1 rounded-md bg-[--color-neutral-900] text-white text-xs shadow">
                      Dislike
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        aria-label="Edit"
                        className="h-8 w-8 btn-base border border-[--color-neutral-300] bg-white text-[--color-neutral-900] hover:bg-[--color-neutral-50] disabled:opacity-50"
                        disabled={isTyping}
                        onClick={() => {
                          setEditedPitch(pitch);
                          const el = pitchBoxRef.current;
                          if (el) setPitchBoxMinHeight(el.getBoundingClientRect().height);
                          setIsEditing(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4 text-[--color-neutral-700]" strokeWidth={2.2} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={6} className="px-2 py-1 rounded-md bg-[--color-neutral-900] text-white text-xs shadow">
                      Edit
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <Tooltip.Root delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <button type="button" onClick={handleCopy} aria-label="Copy response" className="h-8 w-8 btn-base border border-[--color-neutral-300] bg-white text-[--color-neutral-900] hover:bg-[--color-neutral-50]">
                        <CopyIcon className="w-4 h-4 text-[--color-neutral-700]" strokeWidth={2.2} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="top" sideOffset={6} className="px-2 py-1 rounded-md bg-[--color-neutral-900] text-white text-xs shadow">
                      Copy
                    </Tooltip.Content>
                  </Tooltip.Root>

                  <ShareMenu text={pitch} />
                </Tooltip.Provider>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
