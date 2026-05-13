export interface MaterialFormProps {
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}