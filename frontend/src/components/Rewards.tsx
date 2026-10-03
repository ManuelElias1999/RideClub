import { ArrowRight, Coins, Clock, Ticket, ArrowUpRight } from "lucide-react";
import { type Brand, type Reward } from "../data/catalog";
import { useCatalog } from "../data/CatalogContext";
import type { Account, Coupon } from "../lib/demo";
import { BrandLogo, fmt, Modal, RewardIcon, SectionHead } from "./ui";
export default function Rewards({
  filter,
  setFilter,
  account,
  coupons,
  onSelect,
  onJoin,
}: {
  filter: Brand | "Todas";
  setFilter: (b: Brand | "Todas") => void;
  account?: Account;
  coupons: Coupon[];
  onSelect: (r: Reward) => void;
  onJoin: () => void;
}) {
  const { brands, rewards } = useCatalog();
  return (
    <section className="page-section">
      <div className="page-intro">
        <span className="eyebrow">BIENVENIDO AL LADO BUENO DE RODAR</span>
        <h1>
          Tus puntos.
          <br />
          <em>Tu próxima recompensa.</em>
        </h1>
        <p>
          Cuida tu moto, completa tu equipo y vuelve al camino.
          <br />
          Canjea los puntos de cada marca por beneficios de un solo uso.
        </p>
      </div>
      <div className="rewards-summary">
        <div>
          <Coins size={23} />
          <span>
            {account
              ? `Tienes ${fmt(Object.values(account.points).reduce((sum, p) => sum + p, 0))} puntos en tu club`
              : "Únete al club y empieza a sumar puntos"}
            <small>Los puntos se acumulan y canjean por marca.</small>
          </span>
        </div>
        {account ? (
          <div className="balance-chips">
            {brands.map((b) => (
              <span key={b}>
                {b}
                <strong>{fmt(account.points[b])}</strong>
              </span>
            ))}
          </div>
        ) : (
          <button className="button dark" onClick={onJoin}>
            Crear cuenta <ArrowUpRight size={17} />
          </button>
        )}
      </div>
      <div className="proposal-note">
        <Ticket size={18} />
        <span>
          <strong>Catálogo de beneficios propuesto para la hackathon.</strong>{" "}
          Condiciones, puntos y cupos de demostración; sujetos a aprobación de
          cada marca.
        </span>
      </div>
      <SectionHead eyebrow="ALGO BUENO TE ESPERA" title="Elige tu beneficio.">
        <span className="count-label">Canje único / cupón digital</span>
      </SectionHead>
      <div className="brand-tabs reward-tabs">
        {(["Todas", ...brands] as const).map((b) => (
          <button
            key={b}
            className={filter === b ? "active" : ""}
            onClick={() => setFilter(b)}
          >
            {b}
            {filter === b && <span />}
          </button>
        ))}
      </div>
      <div className="reward-grid">
        {rewards
          .filter((r) => filter === "Todas" || r.brand === filter)
          .map((r) => {
            const left =
              r.stock - coupons.filter((c) => c.rewardId === r.id).length;
            return (
              <article
                className={`reward-card ${r.brand.toLowerCase()}`}
                key={r.id}
              >
                <div className={`reward-art ${r.image ? "with-photo" : ""}`}>
                  {r.image && (
                    <img className="reward-cover" src={r.image} alt={r.title} />
                  )}
                  <span className="reward-icon">
                    <RewardIcon kind={r.kind} size={46} />
                  </span>
                  <BrandLogo brand={r.brand} />
                  <span className="reward-art-word" aria-hidden="true">
                    {r.kind === "service"
                      ? "CARE"
                      : r.kind === "parts"
                        ? "GEAR"
                        : "RIDE"}
                  </span>
                  <span className="category-tag">{r.category}</span>
                </div>
                <div className="reward-info">
                  <span className="eyebrow muted">
                    {r.brand} / CUPÓN DE UN SOLO USO
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.detail}</p>
                  <div className="reward-meta">
                    <span>
                      <Clock size={14} />
                      {r.days} días de vigencia
                    </span>
                    <span>{left} cupos demo</span>
                  </div>
                  <div className="reward-bottom">
                    <strong>
                      <Coins size={19} />
                      {fmt(r.points)} <small>puntos</small>
                    </strong>
                    <button
                      className="button small dark"
                      onClick={() => onSelect(r)}
                      disabled={left <= 0}
                    >
                      {left <= 0 ? "Agotado" : "Ver beneficio"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}
export function RewardDetail({
  reward,
  account,
  onClose,
  onConfirm,
  onJoin,
  error,
}: {
  reward: Reward;
  account?: Account;
  onClose: () => void;
  onConfirm: () => void;
  onJoin: () => void;
  error: string;
}) {
  const balance = account?.points[reward.brand] ?? 0;
  return (
    <Modal title="Tu próxima recompensa" onClose={onClose}>
      <div className="reward-dialog-top">
        <span className="reward-icon">
          <RewardIcon kind={reward.kind} size={39} />
        </span>
        <BrandLogo brand={reward.brand} />
      </div>
      <h3 className="dialog-title">{reward.title}</h3>
      <p>{reward.detail}</p>
      <div className="redeem-calculation">
        <div>
          <span>Costo del beneficio</span>
          <strong>
            {fmt(reward.points)} puntos {reward.brand}
          </strong>
        </div>
        {account && (
          <>
            <div>
              <span>Tu saldo disponible</span>
              <strong>{fmt(balance)} puntos</strong>
            </div>
            <div>
              <span>Saldo después del canje</span>
              <strong>
                {fmt(Math.max(0, balance - reward.points))} puntos
              </strong>
            </div>
          </>
        )}
      </div>
      <h4>Qué incluye y cómo usarlo</h4>
      <p className="fine-print">
        {reward.terms} Válido durante {reward.days} días desde el canje, en un
        establecimiento participante de {reward.brand}. Cupón personal, sin
        transferencias.
      </p>
      <div className="notice">
        <Ticket size={23} />
        <span>
          Recibes un cupón de un solo uso.
          <small>
            En el taller, el cliente confirma y el empleado valida su uso. El
            cupón queda en tu historial.
          </small>
        </span>
      </div>
      <p className="fine-print">
        Beneficio propuesto. Canje simulado; la emisión del NFT en Base Sepolia
        se conectará en la próxima etapa.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {account && balance < reward.points && (
        <p className="form-error">
          Te faltan {fmt(reward.points - balance)} puntos {reward.brand}.
        </p>
      )}
      <button
        className="button primary full"
        disabled={!!account && balance < reward.points}
        onClick={account ? onConfirm : onJoin}
      >
        {account
          ? `Confirmar canje · ${fmt(reward.points)} puntos`
          : "Únete al club para canjear"}
        <ArrowRight size={18} />
      </button>
    </Modal>
  );
}
