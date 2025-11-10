"use client";
import Link from "next/link";
import { SvgLeft, SvgRight } from "./Svg";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SectionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"bg-sky-200 flex flex-col gap-1 p-1 " + className}>
      {children}
    </div>
  );
}

export function TableHolder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 bg-gray-200", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  promo = false,
}: {
  children: React.ReactNode;
  className?: string;
  promo?: boolean;
}) {
  return (
    <section
      className={
        "min-w-xs flex justify-center " +
        (promo ? "bg-sky-600 text-white" : "bg-white text-black")
      }
    >
      <div
        className={
          "max-w-2xl flex-1 min-w-xs bg-red-500/50x p-4 gap-4 flex flex-col " +
          className
        }
      >
        {children}
      </div>
    </section>
  );
}

export function Title({ children }: { children?: React.ReactNode }) {
  return (
    <h1 className="font-bold text-sky-50 bg-sky-600 p-4 gap-4 pl-6 xborder-b-2 border-dotted border-black/30 flex justify-between items-center">
      {children}
    </h1>
  );
  //  <h1 className="font-bold text-amber-800 p-2 border-b-2 border-dotted border-black/30 flex justify-between items-center">
  //     <div className="flex-1">{text}</div>
  //     {children}
  //   </h1>;
}

export function LinkButton(
  props: React.ComponentProps<typeof Link> & { children: React.ReactNode }
) {
  return (
    <Link
      {...props}
      className={
        "bg-sky-500 text-white text-sm font-normal px-2 py-1 -my-1 .5 transition-all " +
        "active:opacity-80 " +
        " hover:bg-sky-600 "
      }
    >
      {props.children}
    </Link>
  );
}
export function OwnerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }
) {
  return (
    <button
      {...props}
      className={cn(
        `bg-amber-600 text-white text-sm -my-1 font-normal px-2 py-1 transition-all 
        active:brightness-125 cursor-pointer 
        hover:opacity-80`,
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export function OwnerLinkButton(
  props: React.ComponentProps<typeof Link> & { children: React.ReactNode }
) {
  return (
    <Link
      {...props}
      className={
        "bg-amber-600 text-white text-sm -my-1 font-normal px-2 py-1 transition-all " +
        "active:opacity-80 active:ring-8 " +
        "hover:ring-4 hover:ring-white -600/20 "
      }
    >
      {props.children}
    </Link>
  );
}

export function TitleLinkButton(
  props: React.ComponentProps<typeof Link> & { children: React.ReactNode }
) {
  return (
    <Link
      {...props}
      className={
        "bg-sky-50 text-sky-700 text-sm -my-1 font-normal px-2 py-1 transition-all " +
        "active:opacity-80 " +
        "hover:bg-sky-200 "
      }
    >
      {props.children}
    </Link>
  );
}
export function TitleButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }
) {
  return (
    <button
      {...props}
      className={cn(
        "bg-sky-50 text-sky-700 text-sm -my-1 font-normal px-2 py-1 transition-all cursor-pointer flex gap-2 ",
        "active:opacity-80 ",
        "hover:bg-sky-200 ",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
export function DefaultLink({
  children,
  href,
  external = false,
}: Readonly<{
  children: React.ReactNode;
  href?: string | undefined | null;
  external?: boolean;
}>) {
  if (!href)
    return <span className="font-normal text-sm opacity-50">no url</span>;
  return (
    <Link
      href={href || "/"}
      target={external ? "_blank" : "_self"}
      className="font-normal text-sm text-sky-800 underline flex gap-1 items-start overflow-hidden"
    >
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">
        {children}
      </span>
      {external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
          <path d="M11 13l9 -9" />
          <path d="M15 4h5v5" />
        </svg>
      )}
    </Link>
  );
}

export type PageNavigatorProps = {
  onPrev: () => void;
  onNext: () => void;
  currPage?: number;
  totalPages?: number;
};
export default function PageNavigator({
  onPrev,
  onNext,
  currPage = 0,
  totalPages = 0,
}: PageNavigatorProps) {
  return (
    <div className="p-4 bg-sky-100 border-sky-200 gap-2 flex justify-between items-center px-6">
      <div className="text-xs italic flex-1 text-sky-800">
        {`page ${Math.min(currPage, totalPages)} of ${totalPages}`}
      </div>
      <button
        className="text-sky-800 disabled:text-sky-200 not-disabled:cursor-pointer"
        onClick={onPrev}
        disabled={currPage < 2}
      >
        <SvgLeft />
      </button>
      <button
        className="text-sky-800 disabled:text-sky-200 not-disabled:cursor-pointer"
        onClick={onNext}
        disabled={currPage >= totalPages}
      >
        <SvgRight />
      </button>
    </div>
  );
}

export function FormInput({
  title,
  error,
  required = false,
  ...props
}: {
  title: string;
  error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex justify-between px-2">
        <label htmlFor="name" className="">
          {title}
          {required && "*"}
        </label>
        <span className="text-red-500 text-sm">{error}</span>
      </div>

      <input
        className="p-2 bg-white sky-50 rounded-smx ring-2 ring-sky-200 
        outline-none focus:ring-sky-500
        disabled:saturate-0 disabled:text-neutral-500"
        type="text"
        {...props}
        aria-invalid={!!error}
        aria-describedby={!!error ? `${props.name}-error` : undefined}
      />
    </div>
  );
}

export function FormText({
  title,
  error,
  required = false,
  ...props
}: {
  title: string;
  error: string | undefined;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex justify-between px-2 items-center gap-2">
        <label htmlFor="name" className="flex-1">
          {title}
          {required && "*"}
        </label>
        <span className="text-red-500 text-sm">{error}</span>
        {props.children}
      </div>

      <textarea
        className="p-2 bg-white sky-50 xrounded-sm ring-2 ring-sky-200 
        outline-none focus:ring-sky-500
        disabled:saturate-0 disabled:text-neutral-500"
        {...props}
        rows={5}
        aria-invalid={!!error}
        aria-describedby={!!error ? `${props.name}-error` : undefined}
      />
    </div>
  );
}

export function FormButtons({
  busy = false,
  title = "Submit",
  onReset,
}: {
  busy: boolean;
  title: string;
  onReset?: () => void;
}) {
  return (
    <div className="px-2 flex gap-2 mx-auto w-2/3">
      <button
        className="p-2 text-white bg-sky-600 rounded-xs m-2 w-1/2 mx-auto 
        outline-none focus:ring-sky-800 focus:ring-2
        cursor-pointer active:opacity-80"
        type="button"
        onClick={onReset}
      >
        Reset
      </button>

      <button
        disabled={busy}
        className="p-2 text-white bg-sky-600 rounded-xs m-2 w-1/2 mx-auto 
        outline-none focus:ring-sky-800 focus:ring-2
        disabled:saturate-0 
        active:opacity-80
        disabled:opacity-50 not-disabled:cursor-pointer"
        type="submit"
      >
        {busy ? "Wait..." : title}
      </button>
    </div>
  );
}

export function MenuLink({
  children,
  href,
}: Readonly<{
  children: React.ReactNode;
  href: string;
}>) {
  const path = usePathname();
  let current = path.startsWith(href);
  if (href === "/" && path !== "/") current = false;

  //const current = false;
  return (
    <Link
      href={href}
      className={
        "p-4 whitespace-nowrap hover:bg-white/50 flex gap-4 items-center x-mb-1 z-30 " +
        (current
          ? "border-b-4 pb-3 border-amber-800 "
          : "border-b-4 pb-3 border-amber-800/10 ")
      }
    >
      {children}
    </Link>
  );
}
