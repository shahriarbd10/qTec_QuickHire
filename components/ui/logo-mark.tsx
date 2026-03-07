import Image from "next/image";

export function LogoMark({
  invert = false,
  src = "/images/hero/logo.png",
}: {
  invert?: boolean;
  src?: string;
}) {
  return (
    <span className="relative block h-8 w-[152px]">
      <Image
        src={src}
        alt="QuickHire"
        fill
        className={invert ? "object-contain object-left brightness-0 invert" : "object-contain object-left"}
        sizes="152px"
      />
    </span>
  );
}
