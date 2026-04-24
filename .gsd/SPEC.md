# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Build a premium, AI-powered blogging platform for Hivon Automations that demonstrates seamless integration of Next.js, Supabase, and Google AI, with robust role-based access control and a Figma-inspired design aesthetic.

## Goals
1. Implement a three-tier role system (Author, Viewer, Admin) with Supabase Auth.
2. Build a full-stack blogging system with CRUD operations for posts and comments.
3. Integrate Google AI API to automatically generate and store ~200-word summaries for every post.
4. Deploy a production-ready application to Vercel/Netlify with full environment configuration.
5. Achieve a premium "Figma-inspired" visual aesthetic using monochrome chrome and vibrant content.

## Non-Goals (Out of Scope)
- Advanced analytics or SEO tracking beyond standard metadata.
- Third-party social media integrations (except for manual sharing).
- Multi-language support (English only for v1).

## Users
- **Viewer**: Consumes blog content, reads AI summaries, and leaves comments.
- **Author**: Creates and manages their own blog posts; monitors discussion on their content.
- **Admin**: Oversees the entire platform; has full authority to edit/delete any content or moderate comments.

## Constraints
- **Tech Stack**: Next.js, Supabase Auth/DB, Google AI API.
- **Timeline**: Immediate execution for assignment evaluation.
- **UI/UX**: Must follow "Figma-inspired" design system (monochrome interface, specific typography).

## Success Criteria
- [ ] Application is live and publicly accessible via URL.
- [ ] Role-based access control correctly restricts/allows actions (Author/Admin/Viewer).
- [ ] AI summaries are automatically generated on post creation and stored in database.
- [ ] Search and pagination are functional on the post listing page.
- [ ] README includes comprehensive setup and architectural explanations.
