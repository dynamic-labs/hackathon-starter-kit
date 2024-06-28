"use client";

import { FC } from "react";
import { blo } from "blo";

type BlockieAvatarProps = {
  address: string;
  ensImage?: string | null | undefined;
  size: number | string;
};

// Custom Avatar for RainbowKit
export const BlockieAvatar: FC<BlockieAvatarProps> = ({ address, ensImage, size }) => (
  // Don't want to use nextJS Image here (and adding remote patterns for the URL)
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full"
    src={ensImage || blo(address as `0x${string}`)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
);
