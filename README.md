# RAG + Knowledge Base System

A full-stack web application that enables users to query a knowledge base using Retrieval-Augmented Generation (RAG) pipeline. Built with NestJS (backend) and Vue.js (frontend).

## Architecture Overview

### Backend (NestJS)

#### Core Modules:
1. **Auth Module**
   - JWT-based authentication
   - In-memory user storage (development only)
   - Registration and login endpoints

2. **Knowledge Base Module**
   - Document upload and management
   - Document chunking and embedding
   - Integration with ChromaDB for vector storage

3. **RAG Module**
   - Query processing
   - Context retrieval
   - OpenAI integration for response generation
   - Feedback collection system

### Frontend (Vue.js)

#### Key Components:
1. **Authentication**
   - Login/Register forms
   - JWT token management
   - Protected routes

2. **Knowledge Base Management**
   - Document upload with drag-and-drop
   - Document list and management
   - Progress indicators

3. **RAG Interface**
   - Query input
   - Response display with context highlighting
   - Feedback collection

## Implementation Details

### Authentication Flow
typescript:backend/src/auth/auth.service.ts


The system uses JWT-based authentication with in-memory user storage. In production, this should be replaced with a proper database implementation.

### RAG Pipeline
typescript:backend/src/rag/rag.service.ts


The RAG pipeline:
1. Receives user query
2. Retrieves relevant context from ChromaDB
3. Generates response using OpenAI
4. Stores query history and feedback

### Document Processing
typescript:backend/src/knowledge-base/knowledge-base.service.ts



Supports:
- Multiple file formats (TXT, PDF, CSV, JSON)
- File size validation
- Progress tracking
- Error handling

## Trade-offs and Limitations

1. **In-Memory Storage**
   - Current Implementation: Users and query history stored in memory
   - Production Need: Should use PostgreSQL/MongoDB for persistence
   - Impact: Data loss on server restart

2. **Authentication**
   - Current: Basic JWT implementation
   - Improvement Needed: Refresh tokens, password reset, email verification

3. **Vector Store**
   - Using: ChromaDB
   - Trade-off: Simpler setup vs potentially better performance with FAISS

4. **Error Handling**
   - Basic error interceptor implemented
   - Could be enhanced with more detailed error tracking

5. **Rate Limiting**
   - Basic rate limiting implemented
   - Could be improved with Redis-based solution

## Security Considerations

1. **Authentication**
   - JWT secret stored in environment variables
   - Token expiration implemented
   - CORS configured for development

2. **File Upload**
   - File size limits
   - Type validation
   - Secure file storage needed in production

## Future Improvements

1. **Database Integration**
   - Implement proper database for user management
   - Store document metadata and query history

2. **Enhanced RAG Pipeline**
   - Implement re-ranking of retrieved documents
   - Add support for more document types
   - Implement caching for frequent queries

3. **Monitoring & Analytics**
   - Add telemetry for query performance
   - Track user feedback patterns
   - Monitor system resource usage

4. **UI/UX Enhancements**
   - Add dark mode support
   - Implement better mobile responsiveness
   - Add document preview functionality

## Setup Instructions

1. Environment Setup
yaml:docker-compose.yml


2. Required Environment Variables:
   - OPENAI_API_KEY
   - JWT_SECRET
   - PORT (optional)

3. Development Mode:
```bash
# Start services
docker-compose -f docker-compose.dev.yml up

# Install dependencies
npm install

# Start backend
npm run start:dev

# Start frontend
npm run dev
```

4. Production Mode:
