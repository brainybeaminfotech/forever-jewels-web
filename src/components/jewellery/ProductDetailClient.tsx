"use client";

import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/ui";
import { CATEGORY_META, getRelatedProducts } from "@/lib/catalog";
import { ProductGallery } from "./ProductGallery";
import { BuyBox } from "./BuyBox";
import { ProductAccordions } from "./ProductAccordions";
import { TrustBadges } from "./TrustBadges";
import { ProductCarouselSection } from "./ProductCarouselSection";
import type { MetalOptionId, Product, ProductMediaVariant } from "@/types";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [metal, setMetal] = useState<MetalOptionId | undefined>(product.metalOptions?.[0]?.id);

  // Real per-tone photography when we have it; otherwise fall back to the legacy flat image
  // list as a single synthetic "variant" so ProductGallery never has to special-case this.
  const variants = useMemo<ProductMediaVariant[]>(() => {
    if (product.variantMedia && product.variantMedia.length > 0) return product.variantMedia;
    const legacy = product.images && product.images.length > 0 ? product.images : [product.image, product.hoverImage].filter((v): v is string => Boolean(v));
    return [{ metal: product.metalOptions?.[0]?.id ?? "yellow-gold", images: [...new Set(legacy)] }];
  }, [product]);

  const related = useMemo(() => getRelatedProducts(product), [product]);

  const categoryMeta = product.jewelleryCategory ? CATEGORY_META[product.jewelleryCategory] : undefined;

  return (
    <div className="mx-auto max-w-360 px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pt-52">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(categoryMeta ? [{ label: categoryMeta.label, href: `/jewellery/${categoryMeta.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[60fr_40fr] lg:gap-12">
        <ProductGallery variants={variants} activeMetal={metal} name={product.name} />
        <BuyBox product={product} metal={metal} onMetalChange={setMetal} />
      </div>

      <ProductAccordions product={product} />
      <TrustBadges />
      <ProductCarouselSection title="You May Also Like" products={related} />
    </div>
  );
}
