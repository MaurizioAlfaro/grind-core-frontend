import type { Item } from "../../types";
import { ItemRarity, ItemType, ItemCategory } from "../../types";

export const reptilianParts: { [key: string]: Item } = {
  reptilian_scale: {
    id: "reptilian_scale",
    name: "Reptilian Scale",
    rarity: ItemRarity.Rare,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "An iridescent scale from a high-ranking reptilian. It hums with latent energy.",
    icon: "鱗",
  },
  cybernetic_eye: {
    id: "cybernetic_eye",
    name: "Cybernetic Eye",
    rarity: ItemRarity.Epic,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "A discarded optical implant. It seems to have recorded countless secret meetings.",
    icon: "👁️‍🗨️",
  },
  adamantium_claw: {
    id: "adamantium_claw",
    name: "Adamantium Claw",
    rarity: ItemRarity.Legendary,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "The sharpened talon of a reptilian elder. It can slice through reality itself.",
    icon: "爪",
  },
  biomesh_plating: {
    id: "biomesh_plating",
    name: "Bio-Mesh Plating",
    rarity: ItemRarity.Epic,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "Flexible, self-repairing armor plating. A marvel of alien engineering.",
    icon: "🌐",
  },
  "neuro-link_cable": {
    id: "neuro-link_cable",
    name: "Neuro-Link Cable",
    rarity: ItemRarity.Epic,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "A direct interface to the Reptilian hive mind. Prone to static.",
    icon: "🔌",
  },
  plasma_inducer: {
    id: "plasma_inducer",
    name: "Plasma Inducer",
    rarity: ItemRarity.Epic,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description: "A key component in their energy weapons. Still warm.",
    icon: "🔥",
  },
  elders_sigil: {
    id: "elders_sigil",
    name: "Elder's Sigil",
    rarity: ItemRarity.Legendary,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "A mark of authority among the Reptilian elite. It feels heavy with responsibility.",
    icon: "🔱",
  },
  shapeshifters_gene: {
    id: "shapeshifters_gene",
    name: "Shapeshifter's Gene",
    rarity: ItemRarity.Legendary,
    type: ItemType.Stackable,
    category: ItemCategory.Reptilian,
    powerBonus: 0,
    description:
      "The genetic key to their infiltration abilities. Highly unstable.",
    icon: "🧬",
  },
};
