"use client";

import { NEW_ARRIVALS } from "@/data/products";
import { Container, SectionHeading } from "@/components/common";
import { ProductCard, Button } from "@/components/ui";
import { StaggerContainer, StaggerItem } from "@/components/animations";

export function NewArrivals() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="Just Landed"
          title="New Arrivals"
          description="Fresh from our atelier — the latest additions to the Forever Jewels collection."
        />

        <StaggerContainer className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {NEW_ARRIVALS.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-14 flex justify-center">
          <Button href="/collections/new-arrivals" variant="outline" size="lg">
            View All New Arrivals
          </Button>
        </div>
      </Container>
    </section>
  );
}
