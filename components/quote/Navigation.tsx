import Button from "../ui/Button";

interface NavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export default function Navigation({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
  nextLabel = "Próximo",
}: NavigationProps) {
  return (
    <div className="mt-10 flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        className={!canGoBack ? "invisible" : ""}
      >
        Voltar
      </Button>

      <Button
        variant="primary"
        onClick={onNext}
        className={!canGoNext ? "opacity-50 pointer-events-none" : ""}
      >
        {nextLabel}
      </Button>
    </div>
  );
}