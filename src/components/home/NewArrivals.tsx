import { Container, SectionHeading } from "@/components/common";
import { ProductCard, Button } from "@/components/ui";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { getLatestProducts } from "@framework/product/get-all-products";

/**
 * Server component so the rail renders live catalog products. It previously used the
 * static NEW_ARRIVALS mock, whose slugs no longer exist in the API — every card on the
 * home page linked to a 404.
 */
export async function NewArrivals() {
  const products = await getLatestProducts(8);

  // Nothing to show is better than an empty grid with a heading over it.
  if (products.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow="Just Landed"
          title="New Arrivals"
          description="Fresh from our atelier — the latest additions to the Forever Jewels collection."
        />

        <StaggerContainer className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-14 flex justify-center">
          <Button href="/jewellery" variant="outline" size="lg">
            View All New Arrivals
          </Button>
        </div>
      </Container>
    </section>
  );
}
