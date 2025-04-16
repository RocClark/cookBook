"use client";

import "swagger-ui-react/swagger-ui.css";
import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function SwaggerUIComponent() {
  return (
    <div className="swagger-container">
      <SwaggerUI url="/api/v1/api-docs" />
      <style jsx global>{`
        .swagger-container {
          padding: 1rem;
          height: 100vh;
        }
        .swagger-ui .info .title {
          color: #000;
        }
        .swagger-ui {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .swagger-ui .highlight-code {
          margin: 1rem 0;
        }
        .swagger-ui .highlight-code pre {
          background: #263238 !important;
          color: #fff !important;
          padding: 1rem !important;
          border-radius: 4px;
          line-height: 1.5;
        }
        .swagger-ui code[class*="language-"] {
          background: transparent !important;
          color: #fff !important;
          text-shadow: none !important;
          font-family: monospace;
          direction: ltr;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          line-height: 1.5;
          tab-size: 4;
          hyphens: none;
        }
        .swagger-ui .opblock .opblock-section-header {
          background: transparent;
          box-shadow: none;
        }
        .swagger-ui .opblock .opblock-section-header h4 {
          color: #3b4151;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
