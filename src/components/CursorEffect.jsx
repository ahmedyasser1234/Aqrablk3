import React, { useEffect, useState, useRef } from 'react';

const CursorEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [cursorSize, setCursorSize] = useState(35); // حجم أصغر
  const requestRef = useRef(null);
  const particleIdCounter = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // حجم الماوس بحسب الشاشة
      if (window.innerWidth >= 1024) {
        setCursorSize(35);   
      }
    };

    const handleMouseMove = (e) => {
      if (!isDesktop) return;
      
      // تحديث موقع الماوس (نقطة الـ tip بدلاً من المركز)
      setPosition({ x: e.clientX, y: e.clientY });
      
      // إنشاء جسيم دخان جديد خلف الماوس
      const newParticle = {
        id: particleIdCounter.current++,
        x: e.clientX + 5, // أقرب للماوس
        y: e.clientY + 8, // أقرب للماوس
        size: Math.random() * 5 + 3, // أحجام أصغر
        opacity: 0.4,
        life: 1,
      };
      
      // الاحتفاظ بآخر 15 جسيم فقط للأداء
      setParticles((prev) => [...prev.slice(-15), newParticle]);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // ضبط الحجم الافتراضي
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    const updateParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            life: p.life - 0.03, // تقليل عمر الجسيم أسرع
            opacity: p.opacity - 0.02, // تقليل الشفافية أسرع
            size: p.size + 0.3, // جعل الدخان يتوسع ببطء
            y: p.y + 0.3, // جعل الدخان ينزل ببطء
          }))
          .filter((p) => p.life > 0) // حذف الجسيمات المنتهية
      );
      requestRef.current = requestAnimationFrame(updateParticles);
    };

    requestRef.current = requestAnimationFrame(updateParticles);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDesktop]);

  // إخفاء المؤشر الأصلي
  useEffect(() => {
    if (isDesktop) {
      // إخفاء الماوس الأصلي
      document.body.style.cursor = 'none';
      
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [isDesktop]);

  // لا يتم عرض أي شيء على الموبايل أو التابلت
  if (!isDesktop) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* جسيمات الدخان المنبعثة */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20 blur-sm"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* أيقونة الماوس (صورة SVG المعدنية) - نقطة الـ tip في الأعلى */}
      <div
        className="absolute select-none"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-20%, -20%) rotate(-30deg)', // النقطة العليا هي نقطة الضغط
          transition: 'transform 0.05s ease-out', // حركة أسرع
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 6px rgba(100, 200, 255, 0.5))',
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 69.41 63.59"
          className="w-full h-full "
        >
          <defs>
            <style>
              {`
                .cursor-cls-1 { mask: url(#mask); }
                .cursor-cls-2 { fill: url(#radial-gradient-5); }
                .cursor-cls-2, .cursor-cls-3, .cursor-cls-4, .cursor-cls-5, .cursor-cls-6, .cursor-cls-7 { mix-blend-mode: screen; }
                .cursor-cls-3 { fill: url(#linear-gradient-2); }
                .cursor-cls-8 { fill: url(#linear-gradient-3); }
                .cursor-cls-4 { fill: url(#radial-gradient); }
                .cursor-cls-9 { isolation: isolate; }
                .cursor-cls-10 { fill: url(#linear-gradient); opacity: .5; }
                .cursor-cls-5 { fill: url(#radial-gradient-3); }
                .cursor-cls-6 { fill: url(#radial-gradient-4); }
                .cursor-cls-7 { fill: url(#radial-gradient-2); }
              `}
            </style>
            <linearGradient id="linear-gradient" x1="122.07" y1="10.32" x2="122.07" y2="-57.79" gradientTransform="translate(49.21 -87.82) rotate(105.04)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0e2447"/>
              <stop offset="1" stopColor="#775f7d"/>
            </linearGradient>
            <radialGradient id="radial-gradient" cx="125.94" cy="-18.91" fx="125.94" fy="-18.91" r="38.59" gradientTransform="translate(49.21 -87.82) rotate(105.04)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#242424"/>
              <stop offset=".32" stopColor="#272727"/>
              <stop offset=".57" stopColor="#303030"/>
              <stop offset=".79" stopColor="#414141"/>
              <stop offset=".99" stopColor="#575757"/>
              <stop offset="1" stopColor="#595959"/>
            </radialGradient>
            <linearGradient id="linear-gradient-2" x1="121.95" y1="11.01" x2="121.95" y2="-58.63" gradientTransform="translate(49.21 -87.82) rotate(105.04)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#647a8f"/>
              <stop offset=".05" stopColor="#515e74"/>
              <stop offset=".13" stopColor="#322f47"/>
              <stop offset=".18" stopColor="#647a8f"/>
              <stop offset=".2" stopColor="#515e74"/>
              <stop offset=".23" stopColor="#322f47"/>
              <stop offset=".38" stopColor="#647a8f"/>
              <stop offset=".4" stopColor="#515e74"/>
              <stop offset=".44" stopColor="#322f47"/>
              <stop offset=".5" stopColor="#647a8f"/>
              <stop offset=".56" stopColor="#4e5e76"/>
              <stop offset=".59" stopColor="#434f69"/>
              <stop offset=".63" stopColor="#3c4557"/>
              <stop offset=".67" stopColor="#647a8f"/>
              <stop offset=".71" stopColor="#515e74"/>
              <stop offset=".78" stopColor="#322f47"/>
              <stop offset=".92" stopColor="#647a8f"/>
              <stop offset=".95" stopColor="#515e74"/>
              <stop offset="1" stopColor="#322f47"/>
            </linearGradient>
            <linearGradient id="linear-gradient-3" x1="99.96" y1="1.87" x2="137.29" y2="-52.13" gradientTransform="translate(49.21 -87.82) rotate(105.04)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#000"/>
              <stop offset="1" stopColor="#fff"/>
            </linearGradient>
            <mask id="mask" x="28.1" y=".75" width="40.01" height="60.81" maskUnits="userSpaceOnUse">
              <path className="cursor-cls-8" d="M43.85,61.55c7.06-18.57,6.19-43.86-15.75-57.44,4.4-5.16,10.48-4.38,14.37,2.36l23.76,41.23c4.39,7.62.79,13.86-8.01,13.86h-14.37Z"/>
            </mask>
            <radialGradient id="radial-gradient-2" cx="114.86" cy="-27.99" fx="114.86" fy="-27.99" r="34.43" xlinkHref="#radial-gradient"/>
            <radialGradient id="radial-gradient-3" cx="-1293.78" cy="-3686.88" fx="-1293.78" fy="-3686.88" r="28.1" gradientTransform="translate(-269.01 -1284.94) rotate(-120.64) scale(1 .11)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#b0b0b0"/>
              <stop offset=".06" stopColor="#949494"/>
              <stop offset=".15" stopColor="#6c6c6c"/>
              <stop offset=".26" stopColor="#4b4b4b"/>
              <stop offset=".37" stopColor="#2f2f2f"/>
              <stop offset=".48" stopColor="#1a1a1a"/>
              <stop offset=".61" stopColor="#0b0b0b"/>
              <stop offset=".77" stopColor="#020202"/>
              <stop offset="1" stopColor="#000"/>
            </radialGradient>
            <radialGradient id="radial-gradient-4" cx="-513.41" cy="-14785.99" fx="-513.41" fy="-14785.99" r="21.29" gradientTransform="translate(90.27 -1590.87) rotate(-160.3) scale(1 .11)" xlinkHref="#radial-gradient-3"/>
            <radialGradient id="radial-gradient-5" cx="139.3" cy="-2194.29" fx="139.3" fy="-2194.29" r="21.29" gradientTransform="translate(-107.24 -219.25) rotate(121.66) scale(1 .11)" xlinkHref="#radial-gradient-3"/>
          </defs>
          <g className="cursor-cls-9">
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <g id="Glass04Base">
                    <path className="cursor-cls-10" d="M66.23,47.7c4.39,7.62.57,14.94-8.89,13.85l-20.39-8.23c-2.13-.86-4.51-.84-6.62.05l-18.71,7.91c-10.92,1.29-13.39-6.02-8.98-13.64L26.46,6.46c4.41-7.62,11.61-7.61,16,.01l23.77,41.23Z"/>
                    <path className="cursor-cls-4" d="M66.23,47.7c4.39,7.62.67,14.56-9.13,13.55l-20.21-7.98c-2.09-.83-4.42-.81-6.5.05l-19.76,8.19c-9.25-.23-12.4-6.25-7.99-13.86L26.46,6.46c4.41-7.62,11.61-7.61,16,.01l23.77,41.23Z"/>
                    <path className="cursor-cls-3" d="M10.63,62.27l20.04-8.22c2.07-.85,4.38-.86,6.46-.05l21.09,8.3c5.43,0,9.3-2.33,10.35-6.25.69-2.58.11-5.6-1.69-8.72L43.11,6.1C40.85,2.17,37.78,0,34.47,0c-3.31,0-6.38,2.16-8.65,6.09L1.99,47.28c-.73,1.26-1.27,2.52-1.6,3.74-.79,2.94-.38,5.56,1.18,7.6,1.8,2.35,5.02,3.64,9.06,3.65ZM2.64,47.66L26.46,6.46c4.41-7.62,11.61-7.61,16,.01l23.77,41.23c4.39,7.62.79,13.86-8.01,13.85l-21.34-8.31c-2.08-.81-4.4-.79-6.46.07l-19.78,8.2c-8.8,0-12.4-6.25-7.99-13.86Z"/>
                    <g className="cursor-cls-1">
                      <path className="cursor-cls-7" d="M45.17,56.83c7.06-18.57,4.87-39.14-17.08-52.72,4.4-5.16,10.48-4.38,14.37,2.36l23.76,41.23c4.39,7.62.79,13.86-8.01,13.86l-13.05-4.73Z"/>
                    </g>
                  </g>
                  <path className="cursor-cls-5" d="M40.55,2.82c1.41-.84,8.97,9.31,16.88,22.65,7.91,13.35,13.17,24.85,11.76,25.68-1.41.84-8.97-9.31-16.88-22.65-7.91-13.35-13.17-24.85-11.76-25.68Z"/>
                  <path className="cursor-cls-6" d="M25.75,48.92c.42-1.17,9.74,1.09,20.81,5.06,11.07,3.96,19.71,8.13,19.29,9.3-.42,1.17-9.74-1.09-20.81-5.06-11.07-3.96-19.71-8.13-19.29-9.3Z"/>
                  <path className="cursor-cls-2" d="M6.09,39.39c-1.06-.65,3.09-9.3,9.26-19.31C21.52,10.07,27.39,2.49,28.44,3.14c1.06.65-3.09,9.3-9.26,19.31-6.17,10.01-12.04,17.6-13.1,16.94Z"/>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* نقطة ضغط فعلية - نقطة النقر */}
      <div
        className="absolute rounded-full bg-transparent"
        style={{
          left: position.x,
          top: position.y,
          width: '1px',
          height: '1px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CursorEffect;