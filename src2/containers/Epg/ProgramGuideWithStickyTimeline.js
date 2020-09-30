import React, { useEffect, useRef } from 'react';
import { ProgramGuide } from '@accedo/vdkweb-epg';

// making custom sticky timeline as lib support fixed header only when pagination
// is used properly, and in Starhub "all" data is rendered same time already, unfortunately
export const ProgramGuideWithStickyTimeline = props => {
  const epgContainerElement = useRef(null);
  useEffect(() => {
    const element = epgContainerElement.current.querySelector(
      `.${props.theme.timelineContainer}`
    );

    const { y, x: left } = element.getBoundingClientRect();
    const NOW_TEXT_HEIGHT = 25;
    const top = y + window.scrollY + NOW_TEXT_HEIGHT;

    let isFixed = element.style.position === 'fixed';
    const fixOrUnfixHeader = () => {
      if (window.scrollY > top) {
        if (!isFixed) {
          element.style.position = 'fixed';
          element.style.top = `${-NOW_TEXT_HEIGHT}px`;
          element.style.left = `${left}px`;
          isFixed = true;
        }
      } else if (isFixed) {
        element.style.position = 'absolute';
        element.style.top = 0;
        element.style.left = 0;
        isFixed = false;
      }
    };

    window.addEventListener('scroll', fixOrUnfixHeader);

    return () => window.removeEventListener('scroll', fixOrUnfixHeader);
  }, [epgContainerElement.current]);

  return (
    <div ref={epgContainerElement}>
      <ProgramGuide {...props} />
    </div>
  );
};

ProgramGuideWithStickyTimeline.propTypes = ProgramGuide.propTypes;
