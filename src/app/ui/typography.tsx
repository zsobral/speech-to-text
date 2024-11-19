export function H1(props: { children: React.ReactNode }) {
  return <h1 className="font-bold text-2xl mb-4">{props.children}</h1>;
}

export function H2(props: { children: React.ReactNode }) {
  return <h2 className="font-bold text-lg mb-4">{props.children}</h2>;
}
