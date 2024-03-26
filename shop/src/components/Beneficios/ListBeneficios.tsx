import { MovieIcon } from "../icons/movie";
import Image from "../ui/image";
import { Title } from "../ui/tittleSections";

export const ListBeneficios: React.FC<{}> = () => {
  return (
    <section>
      <Title title="NUESTROS BENEFICIOS" />

      <div className="w-full min-h-96 h-auto bg-cover bg-no-repeat mt-4 flex justify-start sm:justify-end items-center sm:px-28 rounded-lg relative pt-[445px] pb-14  sm:py-14 px-5 sm:text-left">
        <Image
          className="-z-10"
          src="/beneficios.png"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="img banner"
        />
        <div className="w-[400px] ">
          <ul className="grid grid-cols-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <li
                key={i}
                className="flex gap-4 justify-center items-center my-4 "
              >
                <MovieIcon className="text-brand h-12 w-12" />
                <div>
                  <h5 className="font-bold text-base">
                    LOREM IPSUM DOLOR SIT AMET
                  </h5>
                  <p className="font-normal text-sm">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                    magna.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
