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
      `}</style>
    </div>
  );
}
