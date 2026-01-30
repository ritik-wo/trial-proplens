# API Integration Guide

## Overview

This directory contains all API integration logic using Axios with proper error handling, token management, and TypeScript types.

## Structure

```
api/
├── client.ts       # Axios instance with interceptors
├── auth.ts         # Authentication API calls
├── agent.ts        # Agent API calls
├── types.ts        # TypeScript types
└── index.ts        # Main export
```

## Setup

### 1. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001
```

### 2. Features

- ✅ Automatic JWT token management
- ✅ Token refresh on 401 errors
- ✅ Request/response interceptors
- ✅ Centralized error handling
- ✅ TypeScript types for all endpoints
- ✅ Loading states with custom hook
