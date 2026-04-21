export default function FullBleed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw]">
      {children}
    </div>
  );
}
