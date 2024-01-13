export default function HeaderAuth({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-4 md:mb-8">
      <h1 className="title text-lg md:text-xl lg:text-2xl">{title}</h1>
      <p className="paragraph mt-1 md:mt-2 text-base md:text-lg">
        {description}
      </p>
    </div>
  );
}
