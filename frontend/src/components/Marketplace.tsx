import { useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Search,
  SlidersHorizontal,
  Zap,
  ChevronRight,
  Check,
  Wrench,
  Users,
  Gift,
} from "lucide-react";
import { type Brand, type Bike } from "../data/catalog";
import { useCatalog } from "../data/CatalogContext";
import { BrandLogo, ExternalLink, fmt, Modal, SectionHead } from "./ui";
export function BikeCard({
  bike,
  favorite,
  onFavorite,
  onOpen,
}: {
  bike: Bike;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
}) {
  const { brandInfo } = useCatalog();
  const identity = brandInfo[bike.brand];
  return (
    <article
      className="bike-card brand-product-card"
      style={{ "--brand-accent": identity?.color ?? "#c6f46a" } as CSSProperties}
    >
      <div className="bike-image">
        <span className="card-brand-signature">
          <BrandLogo brand={bike.brand} />
        </span>
        <span
          className={`category-tag ${bike.brand === "NIU" ? "electric" : ""}`}
        >
          {bike.brand === "NIU" && <Zap size={12} />} {bike.category}
        </span>
        <button
          onClick={onFavorite}
          className={`favorite-button ${favorite ? "selected" : ""}`}
          aria-label={`${favorite ? "Quitar" : "Guardar"} ${bike.name} en favoritas`}
          aria-pressed={favorite}
        >
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>
        <button
          className="image-link"
          onClick={onOpen}
          aria-label={`Ver ${bike.brand} ${bike.name}`}
        >
          <img
            src={bike.image}
            alt={`${bike.brand} ${bike.name}`}
            loading="lazy"
          />
        </button>
      </div>
      <div className="bike-info">
        <span className="eyebrow muted">
          {bike.brand} <span> / {bike.tag}</span>
        </span>
        <button className="bike-title" onClick={onOpen}>
          {bike.name}
          <ArrowUpRight size={23} />
        </button>
        <div className="bike-specs">
          {bike.specs.slice(0, 2).map(([k, v]) => (
            <span key={k}>{v}</span>
          ))}
        </div>
        <div className="bike-price">
          <div>
            {bike.price ? (
              <>
                <strong>
                  {fmt(bike.price)} <small>USDT</small>
                </strong>
                <span>Precio de catálogo</span>
              </>
            ) : (
              <>
                <strong>Consultar precio</strong>
                <span>{bike.region} · disponibilidad local por confirmar</span>
              </>
            )}
          </div>
          <button
            className="round-button"
            onClick={onOpen}
            aria-label={`Detalles de ${bike.name}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
export function BikeDetail({
  bike,
  onClose,
  onReward,
  onBuy,
}: {
  bike: Bike;
  onClose: () => void;
  onReward: (brand: Brand) => void;
  onBuy: (bike: Bike) => void;
}) {
  const { allCompanies } = useCatalog();
  const purchaseRule = allCompanies.find(
    (company) => company.name === bike.brand,
  )?.pointRules.Compra;
  return (
    <Modal title={`${bike.brand} ${bike.name}`} onClose={onClose} wide>
      <div className="product-detail">
        <div className="detail-picture">
          <img src={bike.image} alt={`${bike.brand} ${bike.name}`} />
          <span className="category-tag">{bike.category}</span>
        </div>
        <div>
          <BrandLogo brand={bike.brand} />
          <h3>{bike.name}</h3>
          <p>{bike.description}</p>
          <div className="detail-price">
            {bike.price ? `${fmt(bike.price)} USDT` : "Precio a consultar"}
          </div>
          <p className="fine-print">
            {bike.region}. Precio de referencia, sujeto a confirmación
            comercial. Las compras de prueba usan saldo ficticio y no reservan
            una moto.
          </p>
          <dl className="spec-grid">
            {bike.specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="notice">
            <Gift size={22} />
            <span>
              Tu próxima compra puede darte{" "}
              <strong>
                {fmt(purchaseRule?.points ?? 1000)} puntos {bike.brand}
              </strong>
              .
              <small>
                Vencen en {purchaseRule?.expiryDays ?? 365} días; requiere
                compra confirmada por la tienda.
              </small>
            </span>
          </div>
          {bike.price && (
            <button
              className="button primary full purchase-button"
              onClick={() => onBuy(bike)}
            >
              Comprar con USDT de prueba <ArrowRight size={17} />
            </button>
          )}
          {bike.source && (
            <ExternalLink href={bike.source}>
              Consultar modelo en la tienda
            </ExternalLink>
          )}
          <button
            className="button secondary full"
            onClick={() => onReward(bike.brand)}
          >
            Explorar recompensas {bike.brand}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
export default function Marketplace({
  filter,
  setFilter,
  favorites,
  onFavorite,
  onBike,
  onRewards,
  onJoin,
}: {
  filter: Brand | "Todas";
  setFilter: (brand: Brand | "Todas") => void;
  favorites: string[];
  onFavorite: (id: string) => void;
  onBike: (bike: Bike) => void;
  onRewards: () => void;
  onJoin: () => void;
}) {
  const { bikes, brands, brandInfo } = useCatalog();
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [onlyFav, setOnlyFav] = useState(false);
  const selectedCompany = filter === "Todas" ? undefined : brandInfo[filter];
  const featured =
    (filter !== "Todas" && bikes.find((bike) => bike.brand === filter)) ||
    bikes.find((bike) => bike.id === "z703f") ||
    bikes[0];
  const visible = bikes
    .filter(
      (b) =>
        (filter === "Todas" || b.brand === filter) &&
        (style === "Todos" || b.category === style) &&
        `${b.name} ${b.brand} ${b.category}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (!onlyFav || favorites.includes(b.id)),
    )
    .sort((a, b) =>
      sort === "price"
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : 0,
    );
  return (
    <div
      className={`marketplace-page ${selectedCompany ? "brand-context-page" : ""}`}
      style={
        selectedCompany
          ? ({ "--brand-accent": selectedCompany.color } as CSSProperties)
          : undefined
      }
    >
      <section
        className={`hero ${selectedCompany ? "brand-hero" : ""}`}
        style={
          selectedCompany
            ? ({ "--brand-accent": selectedCompany.color } as CSSProperties)
            : undefined
        }
      >
        <div className="hero-copy">
          {selectedCompany && (
            <div className="hero-brand-identity">
              <BrandLogo brand={filter} />
              <span>MARKETPLACE OFICIAL DE {filter.toUpperCase()}</span>
            </div>
          )}
          <div className="hero-label">
            <span /> EL CLUB DE LOS QUE SIGUEN RODANDO
          </div>
          <h1>
            {selectedCompany ? filter : "Tu próxima ruta."}
            <br />
            <em>
              {selectedCompany
                ? selectedCompany.subtitle
                : "Más recompensas."}
            </em>
          </h1>
          <p>
            {selectedCompany
              ? `Explora las motos, puntos y beneficios de ${filter}.`
              : "Encuentra tu moto. Vive la experiencia."}
            <br />
            Convierte cada compra en algo que te lleve más lejos.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="button primary">
              Explorar motos <ArrowUpRight size={19} />
            </a>
            <button className="hero-link" onClick={onRewards}>
              Descubrir beneficios <ArrowRight size={17} />
            </button>
          </div>
          <div className="hero-bottom">
            <div>
              <strong>{String(brands.length).padStart(2, "0")}</strong>
              <span>marcas. Un solo club.</span>
            </div>
            <div className="mini-brand-list">
              {brands.slice(0, 4).map((b) => (
                <BrandLogo key={b} brand={b} />
              ))}
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-watermark" aria-hidden="true">
            {featured?.name ?? "RIDE"}
          </span>
          <span className="hero-product-label">
            <span>{featured?.brand ?? "RIDECLUB"}</span>{" "}
            {featured?.category ?? "TU PRÓXIMA RUTA"}
          </span>
          <img
            className="hero-bike"
            src={featured?.image ?? "/assets/motorcycle-placeholder.svg"}
            alt={
              featured
                ? `${featured.brand} ${featured.name}`
                : "Moto ilustrativa"
            }
          />
          <div className="hero-model">
            <span>Para ir más allá.</span>
            <button
              disabled={!featured}
              onClick={() => featured && onBike(featured)}
            >
              Conoce {featured?.name ?? "el catálogo"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </div>
          <button className="hero-reward" onClick={onJoin}>
            <span className="reward-dot">
              <Gift size={21} />
            </span>
            <span>
              Rodar tiene sus beneficios.
              <strong>
                Únete a RideClub <ArrowRight size={15} />
              </strong>
            </span>
          </button>
          <div className="hero-index">
            <span>01</span> / RIDE MORE. GET MORE.
          </div>
        </div>
      </section>
      <section className="brand-strip">
        <span>
          MÁS FORMAS DE MOVERTE.
          <br />
          <strong>UNA MISMA PASIÓN.</strong>
        </span>
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => {
              setFilter(b);
              document
                .getElementById("catalogo")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <BrandLogo brand={b} />
            <span>{brandInfo[b].subtitle}</span>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </section>
      <section id="catalogo" className="catalog-section">
        <SectionHead
          eyebrow="ENCUENTRA TU PRÓXIMA MOTO"
          title="Elige cómo quieres rodar."
        >
          <span className="count-label">
            {bikes.length} modelos / {brands.length} empresas
          </span>
        </SectionHead>
        <div className="catalog-toolbar">
          <div className="brand-tabs" aria-label="Filtrar por marca">
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
          <label className="search-field">
            <Search size={18} />
            <input
              placeholder="Busca tu próxima moto"
              aria-label="Buscar motos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        {selectedCompany && (
          <div
            className="brand-focus-banner"
            style={{ "--brand-accent": selectedCompany.color } as CSSProperties}
          >
            <div>
              <span className="eyebrow">CATÁLOGO OFICIAL DE MARCA</span>
              <h2>{selectedCompany.subtitle}</h2>
              <p>
                Estás explorando exclusivamente motos, puntos y experiencias de {filter}.
              </p>
            </div>
            <BrandLogo brand={filter} />
          </div>
        )}
        <div className="filter-row">
          <div className="filter-select">
            <SlidersHorizontal size={16} />
            <label>
              Estilo
              <select
                aria-label="Estilo de moto"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {["Todos", ...new Set(bikes.map((b) => b.category))].map(
                  (x) => (
                    <option key={x}>{x}</option>
                  ),
                )}
              </select>
            </label>
            <button
              className={`favorite-filter ${onlyFav ? "active" : ""}`}
              aria-pressed={onlyFav}
              onClick={() => setOnlyFav(!onlyFav)}
            >
              <Heart size={14} /> Favoritas
            </button>
          </div>
          <label className="sort-label">
            Ordenar por
            <select
              aria-label="Ordenar motos"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Destacadas</option>
              <option value="price">Precio menor a mayor</option>
              <option value="name">Nombre</option>
            </select>
          </label>
        </div>
        <div className="bike-grid">
          {visible.map((b) => (
            <BikeCard
              key={b.id}
              bike={b}
              favorite={favorites.includes(b.id)}
              onFavorite={() => onFavorite(b.id)}
              onOpen={() => onBike(b)}
            />
          ))}
        </div>
        {visible.length === 0 && (
          <div className="empty-state">
            <Search size={30} />
            <h3>No encontramos motos con esos filtros.</h3>
            <button
              className="button secondary"
              onClick={() => {
                setSearch("");
                setStyle("Todos");
                setFilter("Todas");
                setOnlyFav(false);
              }}
            >
              Ver todo el catálogo
            </button>
          </div>
        )}
        <p className="catalog-note">
          Modelos y precios de referencia. Zontes y NIU: catálogos Bolivia.
          Kiden: referencias internacionales; disponibilidad local por
          confirmar.
        </p>
      </section>
      <section className="club-banner">
        <div className="club-banner-copy">
          <span className="eyebrow">CADA COMPRA, UNA NUEVA RECOMPENSA</span>
          <h2>
            No solo compres una moto.
            <br />
            <em>Forma parte del club.</em>
          </h2>
          <p>
            Tus compras, tus cuidados y tus referidos suman.
            <br />
            Cámbialos por beneficios para seguir disfrutando el camino.
          </p>
          <button className="button primary" onClick={onJoin}>
            Quiero ser parte <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="steps">
          <div>
            <span>01</span>
            <Users size={21} />
            <h3>Únete</h3>
            <p>Crea tu cuenta con correo y recibe tu número de referido.</p>
          </div>
          <div>
            <span>02</span>
            <Wrench size={21} />
            <h3>Suma puntos</h3>
            <p>Por compras, mantenimientos y referidos confirmados.</p>
          </div>
          <div>
            <span>03</span>
            <Gift size={21} />
            <h3>Disfruta</h3>
            <p>Canjea por un cupón y úsalo una vez en la tienda o taller.</p>
          </div>
        </div>
      </section>
      <section className="closing-line">
        <Check size={17} />
        <span>Tu experiencia, en un solo lugar.</span>
        <span>Motos. Comunidad. Recompensas.</span>
      </section>
    </div>
  );
}
