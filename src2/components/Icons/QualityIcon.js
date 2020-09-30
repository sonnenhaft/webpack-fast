import React from 'react';
import PropTypes from 'prop-types';

const QualityIcon = ({ iconStyle = '', iconText = '' }) => (
  <svg
    className={iconStyle}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="48"
    height="32"
    viewBox="0 0 48 32"
  >
    <defs>
      <filter
        id="prefix__a"
        width="133.3%"
        height="154.8%"
        x="-16.7%"
        y="-24%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="2.5"
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
        />
        <feMorphology in="SourceAlpha" radius="1" result="shadowSpreadOuter2" />
        <feOffset dy="3" in="shadowSpreadOuter2" result="shadowOffsetOuter2" />
        <feGaussianBlur
          in="shadowOffsetOuter2"
          result="shadowBlurOuter2"
          stdDeviation=".5"
        />
        <feComposite
          in="shadowBlurOuter2"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter2"
        />
        <feColorMatrix
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
        />
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter3" />
        <feGaussianBlur
          in="shadowOffsetOuter3"
          result="shadowBlurOuter3"
          stdDeviation="1"
        />
        <feComposite
          in="shadowBlurOuter3"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter3"
        />
        <feColorMatrix
          in="shadowBlurOuter3"
          result="shadowMatrixOuter3"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="shadowMatrixOuter3" />
        </feMerge>
      </filter>
      <rect id="prefix__b" width="48" height="29.205" x="0" y="1.854" rx="5" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
      <rect
        width="46"
        height="27.205"
        x="1"
        y="2.854"
        fill="#12171B"
        stroke="#E5E6E6"
        strokeLinejoin="square"
        strokeOpacity=".63"
        strokeWidth="2"
        rx="5"
      />
      <text
        fill="#E5E6E6"
        fillOpacity=".63"
        fontFamily="DINPro-Bold, DINPro"
        fontSize="24"
        fontWeight="bold"
      >
        <tspan x="8.004" y="24.544">
          {iconText}
        </tspan>
      </text>
    </g>
  </svg>
);

QualityIcon.propTypes = {
  iconStyle: PropTypes.string,
  iconText: PropTypes.string
};

export { QualityIcon };
