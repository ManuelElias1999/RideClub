import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Gift,
  Menu,
  UserRound,
  X,
  Wrench,
  ShieldCheck,
  Bike as BikeIcon,
} from "lucide-react";
import {
  type Bike,
  type Brand,
  type Reward,
  type ActivityKind,
} from "./data/catalog";
import {
  linkBrand,
  enterAdminDemo,
  buy,
  fundDemo,
  id,
  type Purchase,
  credit,
  initialDemo,
  loadDemo,
  login,
  redeem,
  register,
  storageKey,
  useCoupon,
  type Account,
  type Coupon,
  type Demo,
} from "./lib/demo";
import { CatalogProvider } from "./data/CatalogContext";
import { manageBrand, readBusiness } from "./lib/business";
import Dashboard from "./components/Dashboard";
import Marketplace, { BikeDetail } from "./components/Marketplace";
import Rewards, { RewardDetail } from "./components/Rewards";
import Club, { CouponDialog } from "./components/Club";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import Workshop from "./components/Workshop";
import { BrandLogo, Modal } from "./components/ui";
type Page =
  "marketplace" | "recompensas" | "club" | "taller" | "admin" | "empresa";
const getPage = (): Page => {
  const h = window.location.hash.slice(1);
  return ["recompensas", "club", "taller", "admin", "empresa"].includes(h)
    ? (h as Page)
    : "marketplace";
};
export default function App() {
  const [state, setState] = useState<Demo>(loadDemo);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [page, setPage] = useState<Page>(getPage);
  const [filter, setFilter] = useState<Brand | "Todas">("Todas");
  const [menu, setMenu] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [checkout, setCheckout] = useState<{
    bike: Bike;
    operationId: string;
  }>();
  const [purchase, setPurchase] = useState<Purchase>();
  const [purchaseError, setPurchaseError] = useState("");
  const [auth, setAuth] = useState(false);
  const [created, setCreated] = useState<Account>();
  const [authError, setAuthError] = useState("");
  const [bike, setBike] = useState<Bike>();
  const [reward, setReward] = useState<Reward>();
  const [rewardError, setRewardError] = useState("");
  const [coupon, setCoupon] = useState<Coupon>();
  const [workshopCode, setWorkshopCode] = useState("");
  const [toast, setToast] = useState("");
  const [info, setInfo] = useState(false);
  const brands = state.companies
    .filter((c) => c.status === "active")
    .map((c) => c.name);
  const brandInfo = Object.fromEntries(state.companies.map((c) => [c.name, c]));
  const account = state.accounts.find((a) => a.id === state.currentId);
  const commit = (next: Demo) => {
    stateRef.current = next;
    setState(next);
  };
  const apply = (fn: (s: Demo) => Demo) => {
    try {
      commit(fn(stateRef.current));
      return true;
    } catch (e) {
      setToast((e as Error).message);
      return false;
    }
  };
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      setToast(
        "Tu navegador no permite guardar la demo. Los cambios durarán esta sesión.",
      );
    }
  }, [state]);
  useEffect(() => {
    const listener = () => {
      setPage(getPage());
      setMenu(false);
    };
    window.addEventListener("hashchange", listener);
    if (
      new URLSearchParams(window.location.search).has("ref") &&
      !stateRef.current.currentId
    ) {
      setAuth(true);
    }
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (window.location.hash !== "#catalogo")
      window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `RideClub — ${page === "marketplace" ? "Tu próxima ruta empieza aquí" : page === "club" ? "Mi club" : page === "taller" ? "Taller demo" : "Recompensas"}`;
  }, [page]);
  const staff = account?.role === "admin" || account?.role === "company";
  const dashboardPage: Page = account?.role === "company" ? "empresa" : "admin";
  const dashboardProps = {
    state,
    onMutation: (fn: (s: Demo) => Demo): string | null => {
      try {
        commit(fn(stateRef.current));
        return null;
      } catch (e) {
        return (e as Error).message;
      }
    },
    onLogout: () => {
      commit({ ...stateRef.current, currentId: null });
      navigate("marketplace");
    },
    onWorkshop: () => navigate("taller"),
  };
  const workshopState =
    account?.role === "company"
      ? (() => {
          const view = readBusiness(state);
          return {
            ...state,
            accounts: state.accounts.filter(
              (a) =>
                a.id === account.id || view.clients.some((c) => c.id === a.id),
            ),
            companies: view.companies,
            purchases: view.purchases,
            coupons: view.coupons,
            activities: view.activities,
            catalogBikes: view.bikes,
            catalogRewards: view.rewards,
          };
        })()
      : state;
  useEffect(() => {
    if (filter !== "Todas" && !brands.includes(filter)) setFilter("Todas");
  }, [state.companies, filter]);
  function navigate(p: Page) {
    setPage(p);
    window.location.hash = p === "marketplace" ? "marketplace" : p;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openAuth(mode: "login" | "register" = "register") {
    setAuthMode(mode);
    setAuthError("");
    setCreated(undefined);
    setReward(undefined);
    setBike(undefined);
    setAuth(true);
    setMenu(false);
  }
  function openReward(r: Reward) {
    setRewardError("");
    setReward(r);
  }
  function confirmReward() {
    if (!reward || !account) return;
    try {
      const result = redeem(stateRef.current, account.id, reward);
      commit(result.state);
      setReward(undefined);
      setCoupon(result.coupon);
      setToast("Tu cupón está listo. El saldo de puntos se actualizó.");
    } catch (e) {
      setRewardError((e as Error).message);
    }
  }
  function copy(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() =>
          setToast("Copiado. Compártelo con tu próximo compañero de ruta."),
        )
        .catch(() => setToast(`Copia este dato: ${text}`));
    } else setToast(`Copia este dato: ${text}`);
  }
  function exportCSV() {
    if (
      !["admin", "company"].includes(
        stateRef.current.accounts.find(
          (a) => a.id === stateRef.current.currentId,
        )?.role ?? "",
      )
    ) {
      setToast("Esta operación requiere el rol de administrador de demo.");
      return;
    }
    const view = readBusiness(stateRef.current);
    const cell = (v: string | number) =>
      `"${String(v)
        .replace(/^[=+@-]/, "'$&")
        .replace(/"/g, '""')}"`;
    const rows = [
      [
        "Cliente",
        "Correo",
        "Actividad",
        "Marca",
        "Puntos",
        "Fecha",
        "Referencia",
      ],
      ...view.activities.map((a) => {
        const user = view.clients.find((x) => x.id === a.accountId);
        return [
          user?.name ?? "",
          user?.email ?? "",
          a.label,
          a.brand,
          a.points,
          a.date,
          a.reference ?? "",
        ];
      }),
    ];
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8;" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "rideclub-actividad-demo.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast("Reporte de la demo exportado.");
  }
  const onFavorite = (id: string) => {
    if (!account) {
      openAuth();
      return;
    }
    apply((s) => ({
      ...s,
      accounts: s.accounts.map((a) =>
        a.id === account.id
          ? {
              ...a,
              favorites: a.favorites.includes(id)
                ? a.favorites.filter((x) => x !== id)
                : [...a.favorites, id],
            }
          : a,
      ),
    }));
  };
  const rewardNavigate = (b?: Brand) => {
    if (b) setFilter(b);
    else setFilter("Todas");
    navigate("recompensas");
  };
  return (
    <CatalogProvider state={state}>
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>
      <div className="topbar">
        <span>RIDE MORE. GET MORE.</span>
        <button onClick={() => setInfo(true)}>
          Cada compra, una nueva recompensa.
          <ChevronRight size={13} />
        </button>
        <span>BOLIVIA / EDICIÓN DEMO</span>
      </div>
      <header className="site-header">
        <a
          className="wordmark"
          href="#marketplace"
          onClick={() => navigate("marketplace")}
          aria-label="RideClub inicio"
        >
          <span className="brand-symbol">
            R<span />
          </span>
          ride<span>club</span>
          <span className="wordmark-dot">®</span>
        </a>
        <nav className={menu ? "open" : ""} aria-label="Navegación principal">
          {[
            ["marketplace", "Marketplace"],
            ["recompensas", "Recompensas"],
            ...(!staff
              ? [["club", "Mi club"]]
              : [
                  [
                    dashboardPage,
                    account?.role === "admin" ? "Administración" : "Mi empresa",
                  ],
                ]),
          ].map(([p, label]) => (
            <button
              key={p}
              className={page === p ? "active" : ""}
              onClick={() => navigate(p as Page)}
            >
              {label}
              {page === p && <span />}
            </button>
          ))}
          <button
            className={`admin-nav ${page === "taller" ? "active" : ""}`}
            onClick={() => navigate("taller")}
          >
            <Wrench size={14} /> Taller demo
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="account-button"
            onClick={
              account
                ? () => navigate(staff ? dashboardPage : "club")
                : () => openAuth("login")
            }
          >
            <UserRound size={18} />
            <span>
              {account ? account.name.split(" ")[0] : "Iniciar sesión"}
            </span>
            <ArrowUpRight size={16} />
          </button>
          <button
            className="mobile-menu icon-button"
            aria-expanded={menu}
            aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main">
        {page === "marketplace" && (
          <Marketplace
            filter={filter}
            setFilter={setFilter}
            favorites={account?.favorites ?? []}
            onFavorite={onFavorite}
            onBike={setBike}
            onRewards={() => rewardNavigate()}
            onJoin={account ? () => navigate("club") : () => openAuth()}
          />
        )}
        {page === "recompensas" && (
          <Rewards
            filter={filter}
            setFilter={setFilter}
            account={account?.role === "client" ? account : undefined}
            coupons={state.coupons}
            onSelect={openReward}
            onJoin={openAuth}
          />
        )}
        {page === "club" && staff && (
          <Dashboard key={account.id} {...dashboardProps} />
        )}
        {page === "club" && !staff && (
          <Club
            account={account}
            state={state}
            onJoin={openAuth}
            onLogout={() => {
              commit({ ...stateRef.current, currentId: null });
              setToast("Saliste de la demo. Puedes volver con tu correo.");
            }}
            onRewards={() => rewardNavigate()}
            onCoupon={setCoupon}
            onFavorite={onFavorite}
            onBike={setBike}
            onCopy={copy}
            onBrand={rewardNavigate}
            onLinkBrand={(b) => {
              if (apply((s) => linkBrand(s, account!.id, b)))
                setToast(`Tu perfil está vinculado a ${b}.`);
            }}
            onFund={() => {
              if (apply((s) => fundDemo(s, account!.id)))
                setToast("Se añadieron 20.000 USDT de prueba a tu saldo.");
            }}
          />
        )}
        {(page === "admin" || page === "empresa") &&
          ((page === "admin" && account?.role === "admin") ||
          (page === "empresa" && account?.role === "company") ? (
            <Dashboard key={account.id} {...dashboardProps} />
          ) : (
            <section className="page-section admin-access">
              <ShieldCheck size={35} />
              <span className="eyebrow">
                {page === "admin"
                  ? "ADMINISTRACIÓN GLOBAL"
                  : "ACCESO DE EMPRESAS"}
              </span>
              <h1>
                {page === "admin"
                  ? "El club, en tus manos."
                  : "Tu empresa, en un solo lugar."}
              </h1>
              <p>
                {page === "admin"
                  ? "Este panel requiere el rol de administrador de RideClub."
                  : "Ingresa con el correo que el administrador asignó a tu empresa para consultar su dashboard."}
              </p>
              {account?.role === "company" ? (
                <button
                  className="button primary"
                  onClick={() => navigate("empresa")}
                >
                  Volver a mi empresa
                </button>
              ) : page === "admin" ? (
                <button
                  className="button primary"
                  onClick={() => {
                    commit(enterAdminDemo(stateRef.current));
                    navigate("admin");
                  }}
                >
                  Entrar como administrador demo
                </button>
              ) : (
                <button
                  className="button primary"
                  onClick={() => openAuth("login")}
                >
                  Iniciar sesión de empresa
                </button>
              )}
            </section>
          ))}
        {page === "taller" &&
          (staff ? (
            <Workshop
              key={workshopCode}
              state={workshopState}
              companyBrand={
                account?.role === "company" ? account.brand : undefined
              }
              couponCode={workshopCode}
              onCredit={(a, b, k, r, c) =>
                apply((s) => {
                  manageBrand(s, b);
                  if (
                    s.accounts.find((x) => x.id === s.currentId)?.role ===
                      "company" &&
                    !readBusiness(s).clients.some((x) => x.id === a)
                  )
                    throw Error(
                      "Este cliente no pertenece al ámbito de tu empresa.",
                    );
                  return credit(s, a, b, k, r, c);
                })
              }
              onUse={(id, b, c, w) =>
                apply((s) => {
                  manageBrand(s, b);
                  return useCoupon(s, id, b, c, w);
                })
              }
              onExport={exportCSV}
            />
          ) : (
            <section className="page-section admin-access">
              <Wrench size={35} />
              <span className="eyebrow">ACCESO DE ADMINISTRADOR</span>
              <h1>Gestiona tu club.</h1>
              <p>
                La validación de beneficios y la acreditación de puntos
                corresponden al administrador.
              </p>
              <button
                className="button primary"
                onClick={() => commit(enterAdminDemo(stateRef.current))}
              >
                Entrar como administrador demo <ChevronRight size={18} />
              </button>
              <p className="fine-print">
                Cambiarás a una cuenta de prueba con rol administrador. Tus
                datos de cliente se conservan; puedes volver ingresando con tu
                correo. Los roles son una simulación local, sin autenticación
                segura.
              </p>
            </section>
          ))}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <a className="wordmark" href="#marketplace">
              <span className="brand-symbol">
                R<span />
              </span>
              ride<span>club</span>
              <span className="wordmark-dot">®</span>
            </a>
            <p>
              Cada compra, una nueva recompensa.
              <br />
              Para los que siempre quieren seguir rodando.
            </p>
          </div>
          <div className="footer-brands">
            {brands.map((b) => (
              <a
                key={b}
                href={brandInfo[b].url || "#catalogo"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Sitio ${b}`}
              >
                <BrandLogo brand={b} />
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
          <button
            className="footer-join"
            onClick={account ? () => navigate("club") : () => openAuth()}
          >
            Nos vemos en el camino.
            <strong>
              {account ? "Volver a mi club" : "Únete al club"}
              <ArrowUpRight size={20} />
            </strong>
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RideClub · Prototipo para Hackathon By Paseo</span>
          <button onClick={() => setInfo(true)}>
            Sobre la demo y sus fuentes
            <ArrowUpRight size={13} />
          </button>
          <span>Próxima integración: Base Sepolia</span>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          <span>{toast}</span>
          <button onClick={() => setToast("")} aria-label="Cerrar aviso">
            <X size={17} />
          </button>
        </div>
      )}
      {bike && (
        <BikeDetail
          bike={bike}
          onClose={() => setBike(undefined)}
          onBuy={(b) => {
            setBike(undefined);
            if (!account || account.role !== "client") {
              openAuth("login");
              return;
            }
            setPurchase(undefined);
            setPurchaseError("");
            setCheckout({ bike: b, operationId: id() });
          }}
          onReward={(b) => {
            setBike(undefined);
            rewardNavigate(b);
          }}
        />
      )}
      {checkout && account && (
        <Checkout
          bike={checkout.bike}
          account={account}
          purchase={purchase}
          error={purchaseError}
          onClose={() => setCheckout(undefined)}
          onClub={() => {
            setCheckout(undefined);
            navigate("club");
          }}
          onConfirm={() => {
            try {
              const result = buy(
                stateRef.current,
                account.id,
                checkout.bike.id,
                checkout.operationId,
              );
              commit(result.state);
              setPurchase(result.purchase);
              setPurchaseError("");
            } catch (e) {
              setPurchaseError((e as Error).message);
            }
          }}
        />
      )}
      {reward && (
        <RewardDetail
          reward={reward}
          account={account}
          onClose={() => setReward(undefined)}
          onConfirm={confirmReward}
          onJoin={openAuth}
          error={rewardError}
        />
      )}
      {coupon && (
        <CouponDialog
          coupon={state.coupons.find((c) => c.id === coupon.id) ?? coupon}
          onClose={() => setCoupon(undefined)}
          onWorkshop={(c) => {
            setCoupon(undefined);
            setWorkshopCode(c.id);
            navigate("taller");
          }}
        />
      )}
      {auth && (
        <Auth
          initialMode={authMode}
          onClose={() => {
            setAuth(false);
            if (created) navigate("club");
          }}
          created={created}
          error={authError}
          onRegister={(n, e, phone, c, b) => {
            try {
              const next = register(stateRef.current, n, e, phone, c, b);
              commit(next);
              setCreated(next.accounts.find((a) => a.id === next.currentId));
              setAuthError("");
            } catch (e) {
              setAuthError((e as Error).message);
            }
          }}
          onLogin={(e) => {
            try {
              const next = login(stateRef.current, e);
              commit(next);
              setAuth(false);
              const role = next.accounts.find(
                (a) => a.id === next.currentId,
              )?.role;
              navigate(
                role === "company"
                  ? "empresa"
                  : role === "admin"
                    ? "admin"
                    : "club",
              );
            } catch (e) {
              setAuthError((e as Error).message);
            }
          }}
          onAdminDemo={() => {
            commit(enterAdminDemo(stateRef.current));
            setAuth(false);
            navigate("admin");
          }}
          onDemo={() => {
            commit({ ...stateRef.current, currentId: "demo-rider" });
            setAuth(false);
            navigate("club");
          }}
        />
      )}
      {info && (
        <Modal
          title="Una demo para seguir rodando"
          onClose={() => setInfo(false)}
        >
          <div className="info-icons">
            <BikeIcon />
            <Gift />
            <UserRound />
          </div>
          <p>
            RideClub conecta un marketplace de motos con puntos por marca,
            referidos y cupones de beneficios.
          </p>
          <h4>Catálogos consultados</h4>
          <ul className="source-list">
            <li>
              <a
                href="https://zontesbolivia.com/motos/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Zontes Bolivia · modelos y precios
              </a>
            </li>
            <li>
              <a
                href="https://niubolivia.com/catalogo/"
                target="_blank"
                rel="noopener noreferrer"
              >
                NIU Bolivia · modelos y precios
              </a>
            </li>
            <li>
              <a
                href="https://motofun.com.ar/kiden/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kiden · MotoFun Argentina
              </a>
            </li>
            <li>
              <a
                href="https://m.kiden.cn/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kiden · catálogo oficial internacional
              </a>
            </li>
          </ul>
          <p className="fine-print">
            Referencias consultadas el 3 de octubre de 2026. Disponibilidad y
            precios deben confirmarse con el distribuidor. Las marcas conservan
            sus derechos; este prototipo no implica aprobación comercial.
          </p>
          <h4>Qué puedes probar</h4>
          <p className="fine-print">
            Registro local por correo, celular y marca vinculada, referido de 8
            dígitos, compras con USDT de prueba, favoritas, puntos por marca,
            canje con QR y validación de un solo uso. La demo de Manuel empieza
            con 1.000 puntos Zontes; las cuentas nuevas empiezan con cero puntos
            y 20.000 USDT ficticios para probar compras.
          </p>
          <h4>Siguiente etapa</h4>
          <p className="fine-print">
            Autenticación por correo, creación automática de wallet EVM, backend
            y contratos en Base Sepolia. Actualmente no se crean wallets, tokens
            ni NFTs reales.
          </p>
          <button
            className="button secondary full"
            onClick={() => {
              commit(initialDemo());
              setInfo(false);
              setToast(
                "Demo reiniciada. Las cuentas, canjes y actividades locales volvieron al estado inicial.",
              );
            }}
          >
            Reiniciar datos de esta demo
          </button>
        </Modal>
      )}
    </CatalogProvider>
  );
}
