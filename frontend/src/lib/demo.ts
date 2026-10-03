import {
  brands,
  pointsRules,
  type Brand,
  type Reward,
  type ActivityKind,
} from "../data/catalog";
export type Account = {
  id: string;
  name: string;
  email: string;
  brand: Brand;
  code: string;
  referredBy?: string;
  wallet: { status: "pending"; chainId: 84532 };
  points: Record<Brand, number>;
  favorites: string[];
};
export type Coupon = {
  id: string;
  ownerId: string;
  rewardId: string;
  title: string;
  brand: Brand;
  points: number;
  issuedAt: string;
  expiresAt: string;
  usedAt?: string;
  workshop?: string;
};
export type Activity = {
  id: string;
  accountId: string;
  brand: Brand;
  label: string;
  points: number;
  date: string;
  reference?: string;
  kind?: ActivityKind;
};
export type Demo = {
  version: 1;
  accounts: Account[];
  currentId: string | null;
  coupons: Coupon[];
  activities: Activity[];
};
const seed: Account = {
  id: "demo-rider",
  name: "Manuel",
  email: "manuel@rideclub.demo",
  brand: "Zontes",
  code: "10002026",
  wallet: { status: "pending", chainId: 84532 },
  points: { Zontes: 1000, NIU: 0, Kiden: 0 },
  favorites: [],
};
export const initialDemo = (): Demo => ({
  version: 1,
  accounts: [structuredClone(seed)],
  currentId: null,
  coupons: [],
  activities: [
    {
      id: "seed-points",
      accountId: seed.id,
      brand: "Zontes",
      label: "Compra de bienvenida · demo",
      points: 1000,
      date: new Date().toISOString(),
      reference: "DEMO-001",
      kind: "Compra",
    },
  ],
});
export const id = () => crypto.randomUUID();
export function register(
  state: Demo,
  name: string,
  email: string,
  brand: Brand,
  referredBy: string,
): Demo {
  name = name.trim();
  email = email.trim().toLowerCase();
  referredBy = referredBy.trim();
  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !brands.includes(brand)
  )
    throw Error("Revisa tu nombre, correo y marca.");
  if (state.accounts.some((a) => a.email === email))
    throw Error(
      "Este correo ya tiene una cuenta de demo. Ingresa desde “Ya tengo cuenta”.",
    );
  if (referredBy && !state.accounts.some((a) => a.code === referredBy))
    throw Error(
      "No encontramos ese número de referido en esta demo. Revisa el código o deja el campo vacío.",
    );
  let code: string;
  do {
    code = String(
      10000000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 90000000),
    );
  } while (state.accounts.some((a) => a.code === code));
  const account: Account = {
    id: id(),
    name,
    email,
    brand,
    code,
    referredBy: referredBy || undefined,
    wallet: { status: "pending", chainId: 84532 },
    points: { Zontes: 0, NIU: 0, Kiden: 0 },
    favorites: [],
  };
  return {
    ...state,
    accounts: [...state.accounts, account],
    currentId: account.id,
  };
}
export function login(state: Demo, email: string): Demo {
  const a = state.accounts.find((a) => a.email === email.trim().toLowerCase());
  if (!a)
    throw Error(
      "No encontramos este correo en el navegador. Crea una cuenta de demo.",
    );
  return { ...state, currentId: a.id };
}
export function redeem(
  state: Demo,
  ownerId: string,
  reward: Reward,
  now = new Date(),
): { state: Demo; coupon: Coupon } {
  const account = state.accounts.find((a) => a.id === ownerId);
  if (!account) throw Error("Ingresa a tu club para canjear.");
  if (account.points[reward.brand] < reward.points)
    throw Error(
      `Necesitas ${reward.points - account.points[reward.brand]} puntos ${reward.brand} más.`,
    );
  if (
    state.coupons.filter((c) => c.rewardId === reward.id).length >= reward.stock
  )
    throw Error("Este beneficio se agotó en la demo.");
  const coupon: Coupon = {
    id: `RC-${id().toUpperCase()}`,
    ownerId,
    rewardId: reward.id,
    title: reward.title,
    brand: reward.brand,
    points: reward.points,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + reward.days * 86400000).toISOString(),
  };
  return {
    coupon,
    state: {
      ...state,
      accounts: state.accounts.map((a) =>
        a.id === ownerId
          ? {
              ...a,
              points: {
                ...a.points,
                [reward.brand]: a.points[reward.brand] - reward.points,
              },
            }
          : a,
      ),
      coupons: [coupon, ...state.coupons],
      activities: [
        {
          id: id(),
          accountId: ownerId,
          brand: reward.brand,
          label: `Canje: ${reward.title}`,
          points: -reward.points,
          date: now.toISOString(),
        },
        ...state.activities,
      ],
    },
  };
}
export function useCoupon(
  state: Demo,
  couponId: string,
  brand: Brand,
  customerConfirmed: boolean,
  workshop: string,
  now = new Date(),
): Demo {
  const c = state.coupons.find((c) => c.id === couponId);
  if (!c) throw Error("No se encontró el cupón.");
  if (c.brand !== brand) throw Error("El cupón pertenece a otra marca.");
  if (c.usedAt)
    throw Error("Este cupón ya fue utilizado. No puede volver a canjearse.");
  if (new Date(c.expiresAt) <= now) throw Error("Este cupón está vencido.");
  if (!customerConfirmed) throw Error("Confirma la autorización del cliente.");
  if (!workshop.trim()) throw Error("Indica el nombre del taller.");
  return {
    ...state,
    coupons: state.coupons.map((x) =>
      x.id === c.id
        ? { ...x, usedAt: now.toISOString(), workshop: workshop.trim() }
        : x,
    ),
    activities: [
      {
        id: id(),
        accountId: c.ownerId,
        brand: c.brand,
        label: `Beneficio utilizado: ${c.title}`,
        points: 0,
        date: now.toISOString(),
      },
      ...state.activities,
    ],
  };
}
export function credit(
  state: Demo,
  accountId: string,
  brand: Brand,
  kind: ActivityKind,
  reference: string,
  confirmed: boolean,
): Demo {
  const a = state.accounts.find((a) => a.id === accountId);
  reference = reference.trim().toUpperCase();
  if (!a || !pointsRules[kind] || !brands.includes(brand))
    throw Error("Selecciona un cliente, una marca y una actividad.");
  if (!confirmed || reference.length < 3)
    throw Error(
      "Confirma la actividad e introduce una referencia de al menos 3 caracteres.",
    );
  if (
    state.activities.some((x) => x.brand === brand && x.reference === reference)
  )
    throw Error("Esta referencia ya fue acreditada para esta marca.");
  const award =
    kind === "Referido"
      ? state.accounts.find((x) => x.code === a.referredBy)
      : a;
  if (!award) throw Error("Este cliente no tiene un referido asociado.");
  if (
    kind === "Referido" &&
    state.activities.some(
      (x) =>
        x.kind === "Referido" && x.label === `Referido confirmado: ${a.id}`,
    )
  )
    throw Error("Este referido ya recibió su recompensa.");
  const points = pointsRules[kind];
  return {
    ...state,
    accounts: state.accounts.map((x) =>
      x.id === award.id
        ? { ...x, points: { ...x.points, [brand]: x.points[brand] + points } }
        : x,
    ),
    activities: [
      {
        id: id(),
        accountId: award.id,
        brand,
        label:
          kind === "Referido"
            ? `Referido confirmado: ${a.id}`
            : `${kind} confirmada · ${reference}`,
        points,
        date: new Date().toISOString(),
        reference,
        kind,
      },
      ...state.activities,
    ],
  };
}
export const storageKey = "rideclub-demo-v1";
export function loadDemo(): Demo {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const s = JSON.parse(raw);
      if (
        s.version === 1 &&
        Array.isArray(s.accounts) &&
        Array.isArray(s.coupons) &&
        Array.isArray(s.activities) &&
        s.accounts.every(
          (a: Account) =>
            a.id &&
            a.wallet &&
            a.points &&
            brands.every(
              (b) => Number.isFinite(a.points[b]) && a.points[b] >= 0,
            ) &&
            Array.isArray(a.favorites),
        )
      )
        return s;
    }
  } catch {
    /* Corrupt or unavailable storage: start a fresh demo. */
  }
  return initialDemo();
}
