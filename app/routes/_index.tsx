import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "36000.eth" },
    { name: "description", content: "Welcome to my website" },
  ];
};

export default function Index() {
  return (
    <div>主页</div>
  );
}
