import Image from "next/image";
import Link from "next/link";  

type VehicleCardProps = {
  slug: string;
  image?: string;
  year: number;
  make: string;
  model: string;
  price: string;
  mileage?: string;
  transmission?: string;
  fuelType?: string;
  featured?: boolean;
};

export function VehicleCard({
  slug,
  image,
  year,
  make,
  model,
  price,
  mileage,
  transmission,
  fuelType,
  featured = false,
}: VehicleCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {image ? (
           <Image
  src={image}
  alt={`${year} ${make} ${model}`}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/> 
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Doctor&apos;s Autos
              </p>
              <p className="mt-2 text-xs text-muted/70">
                Vehicle image
              </p>
            </div>
          </div>
        )}

        {featured && (
          <div className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted">{year}</p>

            <h3 className="mt-1 text-lg font-bold tracking-tight text-primary">
              {make} {model}
            </h3>
          </div>

          <p className="whitespace-nowrap text-sm font-bold text-primary">
            {price}
          </p>
        </div>

        {/* Specs */}
        {(mileage || transmission || fuelType) && (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted">
            {mileage && <span>{mileage}</span>}
            {transmission && <span>{transmission}</span>}
            {fuelType && <span>{fuelType}</span>}
          </div>
        )}

        <Link
          href={`/inventory/${slug}`}
          className="mt-5 inline-flex text-sm font-semibold text-primary transition-colors hover:text-secondary"
        >
          View Vehicle
          <span className="ml-2 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}