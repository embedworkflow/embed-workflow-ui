import { useRef, type CSSProperties } from "react";
import type { EwfChangeDetail } from "@embedworkflow/embed-core";
import { useEwfMount } from "./useEwfMount";

export interface EwfFieldProps {
  /** Workflow key (human identifier) the field belongs to. */
  workflowKey?: string;
  /** Workflow id — alternative to `workflowKey`. */
  workflowId?: string;
  /** The field to render, by the name or id it has in the workflow's form. */
  fieldId: string;
  /** Initial value to seed the field with (uncontrolled). */
  defaultValue?: string;
  /** Called on every change with the `ewf:change` detail. */
  onChange?: (detail: EwfChangeDetail) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a single EmbedWorkflow form field (e.g. a Slack-channel picker bound
 * to your managed connection) inside your own form. The actual UI is rendered
 * by the EWF runtime loaded from the CDN; this component just provides the host
 * element and bridges the change event to React.
 *
 * Uncontrolled: the field owns its value and reports changes through `onChange`.
 * The host collects the value and submits it with the rest of their form.
 */
export function EwfField({
  workflowKey,
  workflowId,
  fieldId,
  defaultValue,
  onChange,
  className,
  style,
}: EwfFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEwfMount(ref, onChange, [workflowKey, workflowId, fieldId]);

  return (
    <div
      ref={ref}
      className={["EWF__field", className].filter(Boolean).join(" ")}
      style={style}
      data-workflow-key={workflowKey}
      data-workflow-id={workflowId}
      data-field-id={fieldId}
      data-value={defaultValue}
    />
  );
}
