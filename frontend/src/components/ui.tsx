import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowUpRight, Wrench, Package, Sparkles } from "lucide-react";
import { brandInfo, type Brand, type Reward } from "../data/catalog";
export const fmt = (n: number) => new Intl.NumberFormat("es-BO").format(n);
export const date = (s: string) =>
  new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(s));
export function BrandLogo({
  brand,
  className = "",
}: {
  brand: Brand;
  className?: string;
}) {
  return (
    <img
      className={`brand-logo ${brand.toLowerCase()} ${className}`}
      src={brandInfo[brand].logo}
      alt={brand}
    />
  );
}
export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      {children}
      <ArrowUpRight size={16} />
    </a>
  );
}
export function RewardIcon({
  kind,
  size = 28,
}: {
  kind: Reward["kind"];
  size?: number;
}) {
  const Icon =
    kind === "service" ? Wrench : kind === "parts" ? Package : Sparkles;
  return <Icon size={size} />;
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const d = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    d?.showModal();
    document.body.classList.add("modal-open");
    return () => {
      d?.close();
      document.body.classList.remove("modal-open");
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="modal-title"
    >
      <header className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Cerrar diálogo"
        >
          <X size={22} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
