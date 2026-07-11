import { getStepLabel } from "./services/progress";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  flow: readonly string[];
}

export default function ProgressBar({
  step,
  totalSteps,
  flow,
}: ProgressBarProps) {
  const percentage = (step / totalSteps) * 100;
  const widthValue = percentage + "%";

  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-500">
            Etapa {step} de {totalSteps}
          </span>

          <p className="font-bold text-blue-900">{getStepLabel(flow, step)}</p>
        </div>

        <span className="text-sm font-medium text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-900 transition-all duration-500"
          style={{ width: widthValue }}
        />
      </div>
    </div>
  );
}