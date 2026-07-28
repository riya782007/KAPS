export default function Loading() {
  return (
    <div className="space-y-5 animate-[pop_.3s_ease]">
      <div className="skel h-9 w-72 !rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="skel" style={{ height: 100 }} />))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="skel lg:col-span-2" style={{ height: 220 }} />
        <div className="skel" style={{ height: 220 }} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="skel" style={{ height: 200 }} />
        <div className="skel" style={{ height: 200 }} />
      </div>
    </div>
  );
}
