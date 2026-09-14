import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("edupath_ai_gemini_service")

SYSTEM_INSTRUCTION = """You are EduPath AI, a helpful general-purpose AI assistant powered by Gemini.

You can answer reasonable questions across education, programming, mathematics, science, technology, AI/ML, career guidance, writing, and everyday knowledge.

When EduPath course context is provided, use it to make educational answers more relevant.

However, do not restrict yourself only to the provided syllabus.

If the user asks a question outside the current course, answer it normally.

Explain difficult concepts in simple language when appropriate.

For programming questions, provide clear code and explain the important parts.

For mathematical problems, show the reasoning and final answer clearly.

For educational questions, prioritize correctness and understanding.

Do not invent syllabus information or claim that a resource exists if it is not provided.

Maintain conversation context and understand follow-up questions."""

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "").strip()
        self.model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash").strip()

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5 and self.api_key != "YOUR_REAL_GEMINI_API_KEY")

    def generate_chat_response(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Sends a query to Gemini API using the official google-genai SDK.
        Includes conversation history and optional EduPath context.
        """
        if not self.is_configured():
            return {
                "success": False,
                "error_type": "MISSING_API_KEY",
                "answer": "AI service is not configured. Please add GEMINI_API_KEY to the backend environment.",
                "model": self.model
            }

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self.api_key)

            # Build structured context string
            prompt_parts = []
            if context and any(context.values()):
                ctx_info = []
                if context.get("course"): ctx_info.append(f"Course: {context['course']}")
                if context.get("year"): ctx_info.append(f"Year: {context['year']}")
                if context.get("semester"): ctx_info.append(f"Semester: {context['semester']}")
                if context.get("subject"): ctx_info.append(f"Subject: {context['subject']}")
                if context.get("unit"): ctx_info.append(f"Unit: {context['unit']}")
                if context.get("topic"): ctx_info.append(f"Topic: {context['topic']}")

                prompt_parts.append("Current Student Learning Context:\n" + "\n".join(ctx_info))

            prompt_parts.append("\nConversation History:")
            if conversation_history:
                # Limit history to recent 10 messages for token efficiency
                for msg in conversation_history[-10:]:
                    role = "User" if msg.get("role") in ["user", "human"] else "Assistant"
                    content = msg.get("content", "")
                    prompt_parts.append(f"{role}: {content}")

            prompt_parts.append(f"\nUser Question:\n{user_message}")

            full_prompt = "\n".join(prompt_parts)

            # Execute call using configured model
            response = client.models.generate_content(
                model=self.model,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.7,
                    max_output_tokens=2048,
                )
            )

            answer = response.text if response and response.text else "EduPath AI couldn't generate an answer."

            return {
                "success": True,
                "answer": answer,
                "model": self.model,
                "contextUsed": bool(context and any(context.values()))
            }

        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}", exc_info=True)
            err_msg = str(e)
            if "RESOURCE_EXHAUSTED" in err_msg or "429" in err_msg:
                user_facing_error = "EduPath AI is temporarily busy. Please try again in a moment."
            else:
                user_facing_error = "EduPath AI couldn't respond right now. Please try again."

            return {
                "success": False,
                "error_type": "API_ERROR",
                "answer": user_facing_error,
                "detail": err_msg[:200],
                "model": self.model
            }

gemini_service = GeminiService()
