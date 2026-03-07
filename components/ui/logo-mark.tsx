import Image from "next/image";

export function LogoMark() {
  return (
    <span className="relative block h-8 w-[152px]">
      <Image
        src="/images/hero/logo.png"
        alt="QuickHire"
        fill
        className="object-contain object-left"
        sizes="152px"
      />
    </span>
  );
}
