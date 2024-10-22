// import React, { useEffect, useRef } from 'react';

// export const Monkey404 = () => {
//   const tailRef = useRef(null);

//   useEffect(() => {
//     let animationFrameId;
//     let startTime;

//     const initialD =
//       'M89,315c2.2-15.2-23-13.2-21.6,4.8c1.7,22.3,24.4,22.1,42.5,9.1c10.8-7.8,15.3-1.8,19.1,1.1 c2.3,1.7,6.7,3.3,11-3';
//     const animatedD =
//       'M81,310c-8.8-6.5-20.8,6.5-15,18c7.4,14.5,22.5,10.8,31,3c9.8-9,18.9-5.6,22-2 c5.8,6.8,16.7,4.3,21-2';

//     const duration = 1600;

//     const animate = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;

//       if (progress < duration) {
//         // Animate to 'animatedD'
//         if (tailRef.current) {
//           tailRef.current.setAttribute('d', animatedD);
//         }
//       } else if (progress < 2 * duration) {
//         // Animate back to 'initialD'
//         if (tailRef.current) {
//           tailRef.current.setAttribute('d', initialD);
//         }
//       } else {
//         startTime = timestamp;
//       }

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animationFrameId = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <div className="relative w-[800px] h-[480px] mx-auto my-0">
//       <svg
//         id="monkey_404"
//         viewBox="0 0 800 480"
//         className="absolute left-1/2 top-1/2 -ml-[400px] -mt-[240px]"
//       >
//         {/* Cloud */}
//         <path
//           id="cloud"
//           className="fill-[#e8ebed]"
//           d="M658.4,345.2c-10.9,0-19.7-8.8-19.7-19.7c0-10.9,8.8-19.7,19.7-19.7h50.1c9.9-1.5,17.5-10,17.5-20.3
//           c0-11.4-9.2-20.6-20.6-20.6v-0.2H633c-11.4,0-20.6-6.7-20.6-18.1c0-11.4,9.2-19.3,20.6-19.3h70.4l2-0.2c7.3-3.1,12.5-11,12.5-19.5
//           c0-8.5-4.2-16.7-11.4-19.2l-2.5-0.3h-11.3c-11.9,0-21.6-8.9-21.6-19.9c0-11,9.7-19.9,21.6-19.9h15.8l1.4-0.3
//           c8.6-2.5,14.8-10.1,14.8-19.5c0-11.4-9.2-20.6-20.6-20.6h-1.2h-69.2H382.5c-19.8-0.9-19.9-15.9-19.8-17.8c0-0.1,0-0.1,0-0.2
//           c0-9.9-8.1-18-18-18h-93.5c-9.9,0-18,8.1-18,18c0,9.4,7.2,17.1,16.3,17.9h9.3c0.2,0,0,0,0.6,0l0.5,0l0.4,0l0.2,0
//           c10.1,0.9,18,9.3,18,19.6c0,10.9-8.8,19.7-19.7,19.7h-70.7c-11.3,0-20.5,9.2-20.5,20.6c0,11.3,9.1,20.5,20.4,20.6h48.8
//           c10.3,0,18.7,8.4,18.7,18.7c0,10.3-8.4,18.7-18.7,18.7h-23.2c-11.3,0.1-20.4,9.2-20.4,20.6c0,11.3,9.2,20.5,20.5,20.6h6.3
//           c10.7,0,19.3,8.7,19.3,19.3c0,10.7-7.8,19.3-18.4,19.3l-1.5,0l-2.8,0.4c-7.3,3.1-11.8,11-11.5,18.9c0.3,8.5,4.2,16.5,11.7,19.6
//           c1.1,0.7,3.4,0.9,4.4,0.9h4.5H296h19.7c3.9,0.5,8.2,4.2,7.4,10.4c0,0.4,0,0.8,0.1,1.1c0,0.5-0.1,1-0.1,1.5c0,9.7,7.9,17.5,17.5,17.5
//           h60.2c9.7,0,17.5-7.9,17.5-17.5c0-0.4,0-0.8-0.1-1.2c0.1-0.3,0-0.7,0.1-1.1c0.3-6.5,6.4-10.9,10.6-10.8h110.1
//           c8.5,0,16.9,6.6,16.9,14.8c0,8.2,6.6,14.8,14.8,14.8h92.6c8.2,0,14.8-6.6,14.8-14.8c0-8.2-6.6-14.8-14.8-14.8 M332.8,187.1h-21.2
//           c-11.4,0-20.6-9.2-20.6-20.6c0-11.4,9.2-20.6,20.6-20.6h21.2c11.4,0,20.6,9.2,20.6,20.6C353.3,177.9,344.1,187.1,332.8,187.1z"
//         />
//         {/* Zelda */}
//         {/* Apply animation classes to the elements that need to be animated */}
//         <g id="zelda" className="animate-levitate animation-delay-0">
//           {/* Zelda paths with converted Tailwind classes */}
//         </g>
//         {/* Tail */}
//         <path
//           id="tail"
//           ref={tailRef}
//           className="fill-none stroke-[#89949b] stroke-[4px] stroke-linecap-round stroke-linejoin-round stroke-miterlimit-[10]"
//           d="M89,315c2.2-15.2-23-13.2-21.6,4.8c1.7,22.3,24.4,22.1,42.5,9.1c10.8-7.8,15.3-1.8,19.1,1.1 c2.3,1.7,6.7,3.3,11-3"
//         />
//         {/* Monkey */}
//         <g id="monkey" className="animate-monkey-breathe">
//           {/* Monkey elements with converted Tailwind classes */}
//         </g>
//         {/* Other elements like tetris, moon, stars, numbers, etc., with appropriate animations and classes */}
//       </svg>
//     </div>
//   );
// };
