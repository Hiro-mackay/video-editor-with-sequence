import { useRef } from 'react';

export default function Home() {
  const ref = useRef<HTMLDivElement>();
  const isClient = typeof window !== 'undefined';

  

  return (
    <div className="w-full min-h-screen bg-gray-700">
      <div className="grid grid-cols-2">
        <div
          className="p-24 box-border"
          style={{
            height: 1000
          }}
        >
          <div className="h-full bg-gray-100"></div>
        </div>
        <div className="bg-gray-900 w-full h-full"></div>
      </div>

      <div className="h-96 bg-gray-800" ref={ref}></div>
    </div>
  );
}
