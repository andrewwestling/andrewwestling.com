import Image from "next/image";

export const PhotoOfMe = () => {
  return (
    <figure className="max-w-[500px]">
      <div className="rounded-lg overflow-hidden mb-2">
        <Image
          priority
          width={500}
          height={500}
          src={"/assets/Andrew-M-Westling-2022-1.jpg"}
          alt="Photo of Andrew at Fort Greene Park"
        />
      </div>
      <figcaption className="text-preset-1 text-muted dark:text-muted-dark">
        At Fort Greene Park in Brooklyn, June 2022. Photo by Candice McCardle.
      </figcaption>
    </figure>
  );
};
