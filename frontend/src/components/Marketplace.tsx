import { useState } from "react";
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
import {
  bikes,
  brands,
  brandInfo,
  type Brand,
  type Bike,
} from "../data/catalog";
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
  return (
    <article className="bike-card">
      <div className="bike-image">
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
                <span>Precio publicado · Bolivia</span>
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
}: {
  bike: Bike;
  onClose: () => void;
  onReward: (brand: Brand) => void;
}) {
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
            comercial. Esta demo no procesa compras.
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
              <strong>1.000 puntos {bike.brand}</strong>.
              <small>
                Regla propuesta; requiere compra confirmada por la tienda.
              </small>
            </span>
          </div>
          <ExternalLink href={bike.source}>
            Consultar modelo en la tienda
          </ExternalLink>
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
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [onlyFav, setOnlyFav] = useState(false);
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
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-label">
            <span /> EL CLUB DE LOS QUE SIGUEN RODANDO
          </div>
          <h1>
            Tu próxima ruta.
            <br />
            <em>Más recompensas.</em>
          </h1>
          <p>
            Encuentra tu moto. Vive la experiencia.
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
              <strong>03</strong>
              <span>marcas. Un solo club.</span>
            </div>
            <div className="mini-brand-list">
              <BrandLogo brand="Zontes" />
              <BrandLogo brand="NIU" />
              <BrandLogo brand="Kiden" />
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-watermark" aria-hidden="true">
            703F
          </span>
          <span className="hero-product-label">
            <span>ZONTES</span> ADVENTURE / 2026
          </span>
          <img
            className="hero-bike"
            src="/assets/zontes-703f.jpg"
            alt="Zontes 703F adventure"
          />
          <div className="hero-model">
            <span>Para ir más allá.</span>
            <button onClick={() => onBike(bikes[0])}>
              Conoce la 703F <ArrowUpRight size={17} />
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
          TRES FORMAS DE MOVERTE.
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
          <span className="count-label">09 modelos / 03 marcas</span>
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
                {["Todos", "Adventure", "Scrambler", "Naked", "Eléctrica"].map(
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
    </>
  );
}
