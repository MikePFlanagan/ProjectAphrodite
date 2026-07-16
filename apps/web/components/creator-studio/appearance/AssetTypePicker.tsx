import {
  ImageIcon,
  Mountain,
  Shirt,
  Smile,
  UserRound,
  Video,
  type LucideIcon,
} from 'lucide-react';

import { appearanceAssetTypes } from './config';
import type { AppearanceAssetType } from './types';

type AssetTypePickerProps = {
  value: AppearanceAssetType;
  onChange: (assetType: AppearanceAssetType) => void;
};

const assetIcons: Record<
  AppearanceAssetType,
  LucideIcon
> = {
  portrait: UserRound,
  'full-body': ImageIcon,
  expression: Smile,
  outfit: Shirt,
  scene: Mountain,
  video: Video,
};

export function AssetTypePicker({
  value,
  onChange,
}: AssetTypePickerProps) {
  return (
    <section>
      <div>
        <p className="text-sm font-semibold text-white">
          What are you creating?
        </p>

        <p className="mt-1 text-xs leading-5 text-white/35">
          Choose the type of companion asset you want to create.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 min-[1100px]:grid-cols-2 2xl:grid-cols-3">
        {appearanceAssetTypes.map((option) => {
          const Icon = assetIcons[option.id];
          const active = option.id === value;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={`group flex min-h-24 min-w-0 items-start gap-3 rounded-[20px] border p-4 text-left transition duration-200 ${
                active
                  ? 'border-fuchsia-200/25 bg-fuchsia-300/[0.09] shadow-[0_14px_40px_rgba(217,70,239,0.08)]'
                  : 'border-white/[0.08] bg-white/[0.025] hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.045]'
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl border transition ${
                  active
                    ? 'border-fuchsia-200/15 bg-fuchsia-300/[0.12] text-fuchsia-100'
                    : 'border-white/[0.06] bg-white/[0.035] text-white/40 group-hover:text-white/65'
                }`}
              >
                <Icon className="size-4.5" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block break-words text-sm font-semibold leading-5 text-white">
                  {option.label}
                </span>

                <span className="mt-1 block break-words text-xs leading-5 text-white/35">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
