import React from "react";
import { CommonColors } from "common/styling/commonColors";
import styled from "styled-components";

export interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}
interface SvgProps extends IconProps {
  path: string | string[];
}

const defaultIconColor = CommonColors.NAVY_8;

const Path = styled.path.attrs({ fillRule: "nonzero" })``;

export const SvgGroup = styled.g.attrs({
  stroke: "none",
  strokeWidth: "1",
  fill: "none",
  fillRule: "evenodd",
})``;

export const Svg = styled.svg.attrs({
  viewBox: "0 0 16 16",
  height: "1rem",
  width: "1rem",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink: "http://www.w3.org/1999/xlink",
})``;

const UnreportedSvg = styled.svg.attrs({
  viewBox: "0 0 22 16",
  height: "1rem",
  width: "1.375rem",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  xmlnsXlink: "http://www.w3.org/1999/xlink",
})``;

const SvgIcon = ({ path, color = defaultIconColor, className }: SvgProps) => (
  <Svg className={className}>
    <SvgGroup>
      {Array.isArray(path) ? path.map((d, i) => <Path key={i} d={d} fill={color} />) : <Path d={path} fill={color} />}
    </SvgGroup>
  </Svg>
);

export const UnassignedQnIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M7.57812992,1.00817283 L7.65401617,1.03269134 L13.748128,3.72431607 C13.8787274,3.78199874 13.9704909,3.90762273 13.9940438,4.05402235 L14,4.1287351 L14,12.0011286 C14,12.1554735 13.9246662,12.2962809 13.8050535,12.3745949 L13.7417011,12.4083175 L7.64758927,14.9700786 C7.57640987,15 7.49934619,15.0074804 7.42522465,14.9925196 L7.35241073,14.9700786 L1.25829893,12.4083175 C1.12478929,12.3521945 1.03038268,12.2254188 1.00613404,12.0769463 L1,12.0011286 L1,4.1287351 C1,3.97672043 1.07310647,3.83762044 1.18994463,3.75860082 L1.25187203,3.72431607 L7.34598383,1.03269134 C7.42000034,1 7.50074789,0.991827166 7.57812992,1.00817283 Z M7.37443221,1.90870086 L1.8740113,4.42135004 L1.8740113,11.7024073 L7.00579834,13.90979 L7.00598638,13.4765221 C7.00598638,13.2463898 7.17807947,13.0589341 7.37443221,13.0192418 L7.59244335,13.0192418 C7.79907523,13.0192418 7.97093053,13.1850721 8.00656959,13.4037562 L8.01335098,13.4880196 L8.01316293,13.9212876 L12.8740113,11.7024073 L12.8740113,4.42135004 L7.37443221,1.90870086 Z M7.46877783,10.2578495 C7.69891014,10.2578495 7.8903107,10.4236798 7.93000302,10.642364 L7.93755566,10.7266274 L7.93755566,11.6640811 C7.93755566,11.9229799 7.72767668,12.1328589 7.46877783,12.1328589 C7.23864552,12.1328589 7.04724496,11.9670286 7.00755264,11.7483445 L7,11.6640811 L7,10.7266274 C7,10.4677285 7.20987898,10.2578495 7.46877783,10.2578495 Z M7.46877783,7.53132441 C7.69891014,7.53132441 7.8903107,7.69715472 7.93000302,7.91583884 L7.93755566,8.00010224 L7.93755566,8.7890717 C7.93755566,9.04797055 7.72767668,9.25784953 7.46877783,9.25784953 C7.23864552,9.25784953 7.04724496,9.09201923 7.00755264,8.87333511 L7,8.7890717 L7,8.00010224 C7,7.7412034 7.20987898,7.53132441 7.46877783,7.53132441 Z M9.87309778,5.66372626 C10.114645,5.57054076 10.3859995,5.69081172 10.479185,5.93235898 C10.5620166,6.14706764 10.4761912,6.38532773 10.2864499,6.50107085 L10.2105523,6.53844624 L9.33583235,6.8759008 C9.0942851,6.9690863 8.82293059,6.84881534 8.72974508,6.60726808 C8.64691353,6.39255942 8.73273893,6.15429933 8.92248021,6.03855621 L8.9983778,6.00118082 L9.87309778,5.66372626 Z M4.67593485,6.25810646 C4.75342172,6.04141159 4.97401485,5.91702293 5.19329461,5.95328045 L5.27518089,5.97454078 L6.15799261,6.29022114 C6.40177433,6.37739387 6.52873101,6.64568546 6.44155828,6.88946718 C6.36407142,7.10616205 6.14347829,7.2305507 5.92419852,7.19429319 L5.84231225,7.17303286 L4.95950053,6.8573525 C4.7157188,6.77017977 4.58876212,6.50188818 4.67593485,6.25810646 Z M12.4972577,4.6513626 C12.738805,4.5581771 13.0101595,4.67844806 13.103345,4.91999531 C13.1861765,5.13470398 13.1003511,5.37296407 12.9106099,5.48870718 L12.8347123,5.52608258 L11.9599923,5.86353713 C11.718445,5.95672264 11.4470905,5.83645167 11.353905,5.59490442 C11.2710735,5.38019575 11.3568989,5.14193567 11.5466401,5.02619255 L11.6225377,4.98881715 L12.4972577,4.6513626 Z M2.0725518,5.20583072 C2.17586955,5.00019434 2.40997758,4.9036164 2.62320419,4.96632713 L2.70188911,4.99740842 L3.53964873,5.41832343 C3.77098966,5.53455591 3.8643035,5.81631982 3.74807103,6.04766075 C3.64475328,6.25329713 3.41064525,6.34987507 3.19741864,6.28716434 L3.11873372,6.25608305 L2.2809741,5.83516804 C2.04963317,5.71893557 1.95631933,5.43717165 2.0725518,5.20583072 Z"
    }
  />
);
export const CacheIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M7.57812992,1.00817283 L7.65401617,1.03269134 L13.748128,3.72431607 C13.8787274,3.78199874 13.9704909,3.90762273 13.9940438,4.05402235 L14,4.1287351 L14,12.0011286 C14,12.1554735 13.9246662,12.2962809 13.8050535,12.3745949 L13.7417011,12.4083175 L7.64758927,14.9700786 C7.57640987,15 7.49934619,15.0074804 7.42522465,14.9925196 L7.35241073,14.9700786 L1.25829893,12.4083175 C1.12478929,12.3521945 1.03038268,12.2254188 1.00613404,12.0769463 L1,12.0011286 L1,4.1287351 C1,3.97672043 1.07310647,3.83762044 1.18994463,3.75860082 L1.25187203,3.72431607 L7.34598383,1.03269134 C7.42000034,1 7.50074789,0.991827166 7.57812992,1.00817283 Z M7.46877783,10.2578495 C7.20987898,10.2578495 7,10.4677285 7,10.7266274 L7,10.7266274 L7,11.6640811 L7.00755264,11.7483445 C7.04724496,11.9670286 7.23864552,12.1328589 7.46877783,12.1328589 C7.72767668,12.1328589 7.93755566,11.9229799 7.93755566,11.6640811 L7.93755566,11.6640811 L7.93755566,10.7266274 L7.93000302,10.642364 C7.8903107,10.4236798 7.69891014,10.2578495 7.46877783,10.2578495 Z M7.46877783,7.53132441 C7.20987898,7.53132441 7,7.7412034 7,8.00010224 L7,8.00010224 L7,8.7890717 L7.00755264,8.87333511 C7.04724496,9.09201923 7.23864552,9.25784953 7.46877783,9.25784953 C7.72767668,9.25784953 7.93755566,9.04797055 7.93755566,8.7890717 L7.93755566,8.7890717 L7.93755566,8.00010224 L7.93000302,7.91583884 C7.8903107,7.69715472 7.69891014,7.53132441 7.46877783,7.53132441 Z M5.19329461,5.95328045 C4.97401485,5.91702293 4.75342172,6.04141159 4.67593485,6.25810646 C4.58876212,6.50188818 4.7157188,6.77017977 4.95950053,6.8573525 L4.95950053,6.8573525 L5.84231225,7.17303286 L5.92419852,7.19429319 C6.14347829,7.2305507 6.36407142,7.10616205 6.44155828,6.88946718 C6.52873101,6.64568546 6.40177433,6.37739387 6.15799261,6.29022114 L6.15799261,6.29022114 L5.27518089,5.97454078 Z M10.479185,5.93235898 C10.3859995,5.69081172 10.114645,5.57054076 9.87309778,5.66372626 L9.87309778,5.66372626 L8.9983778,6.00118082 L8.92248021,6.03855621 C8.73273893,6.15429933 8.64691353,6.39255942 8.72974508,6.60726808 C8.82293059,6.84881534 9.0942851,6.9690863 9.33583235,6.8759008 L9.33583235,6.8759008 L10.2105523,6.53844624 L10.2864499,6.50107085 C10.4761912,6.38532773 10.5620166,6.14706764 10.479185,5.93235898 Z M2.62320419,4.96632713 C2.40997758,4.9036164 2.17586955,5.00019434 2.0725518,5.20583072 C1.95631933,5.43717165 2.04963317,5.71893557 2.2809741,5.83516804 L2.2809741,5.83516804 L3.11873372,6.25608305 L3.19741864,6.28716434 C3.41064525,6.34987507 3.64475328,6.25329713 3.74807103,6.04766075 C3.8643035,5.81631982 3.77098966,5.53455591 3.53964873,5.41832343 L3.53964873,5.41832343 L2.70188911,4.99740842 Z M13.103345,4.91999531 C13.0101595,4.67844806 12.738805,4.5581771 12.4972577,4.6513626 L12.4972577,4.6513626 L11.6225377,4.98881715 L11.5466401,5.02619255 C11.3568989,5.14193567 11.2710735,5.38019575 11.353905,5.59490442 C11.4470905,5.83645167 11.718445,5.95672264 11.9599923,5.86353713 L11.9599923,5.86353713 L12.8347123,5.52608258 L12.9106099,5.48870718 C13.1003511,5.37296407 13.1861765,5.13470398 13.103345,4.91999531 Z"
    }
  />
);

export const CacheGroupIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M7.8083145,1.03854853 C7.90614247,0.997430098 8.01454075,0.989206411 8.11659685,1.01387747 L8.1916855,1.03854853 L11.4489107,2.40605532 L11.49033,2.41440808 L11.49033,2.41440808 L11.565326,2.4394288 L14.712115,3.77918024 L14.7508162,3.7976956 L14.7508162,3.7976956 L14.8160576,3.83859361 L14.8160576,3.83859361 L14.8851954,3.90200361 L14.8851954,3.90200361 L14.9422611,3.98279996 L14.9422611,3.98279996 L14.976362,4.06196038 L14.976362,4.06196038 L14.9932332,4.12836787 L14.9932332,4.12836787 L15,4.2064181 L15,11.8582213 C15,12.0182326 14.9156394,12.1650472 14.7800127,12.2500376 L14.7080804,12.2871557 L11.3326282,13.6887525 L8.1858392,14.9638645 C8.09666203,15 7.99906439,15.0090339 7.90567699,14.9909661 L7.8141608,14.9638645 L4.66347924,13.6871557 L1.2919196,12.2871557 C1.14012352,12.2241242 1.03407775,12.0911637 1.00687684,11.9369021 L1,11.8582213 L1.00250858,4.15875975 L1.00250858,4.15875975 L1.01494621,4.0895187 L1.01494621,4.0895187 L1.03158342,4.04017256 L1.03158342,4.04017256 C1.04639793,3.99957371 1.0678155,3.96106491 1.09510524,3.92576457 L1.1309181,3.8850171 L1.1309181,3.8850171 L1.16794473,3.85228272 L1.16794473,3.85228272 L1.21685709,3.81658188 L1.21685709,3.81658188 L1.28788501,3.77918024 L4.434674,2.4394288 C4.4725185,2.42331644 4.5119752,2.41213987 4.55205898,2.40590347 L7.8083145,1.03854853 Z M5.33486239,10.226 L5.33486239,12.9476 L7.51770642,13.8314667 L7.51770642,11.1108 L5.33486239,10.226 Z M10.6648165,10.226 L8.48100917,11.1108 L8.48100917,13.8314667 L10.6648165,12.9466667 L10.6648165,10.226 Z M1.96330275,8.82226667 L1.96330275,11.5504 L4.37155963,12.5509333 L4.37155963,9.78826667 L1.96330275,8.82226667 Z M14.0363761,8.82973333 L11.6281193,9.82 L11.6281193,12.55 L14.0363761,11.5504 L14.0363761,8.82973333 Z M5.33389908,6.34053333 L5.33389908,9.21333333 L7.51770642,10.0981333 L7.51770642,7.26173333 L5.33389908,6.34053333 Z M10.6648165,6.34053333 L8.48100917,7.26173333 L8.48100917,10.0981333 L10.6648165,9.21333333 L10.6648165,6.34053333 Z M14.0363761,4.9172 L11.6281193,5.9336 L11.6281193,8.8064 L14.0363761,7.8152 L14.0363761,4.9172 Z M1.96233945,4.9172 L1.96233945,7.8124 L4.37155963,8.7784 L4.37155963,5.93453333 L1.96233945,4.9172 Z M7.9993578,4.77533333 L6.02844037,5.61533333 L7.9993578,6.44693333 L9.97027523,5.61533333 L7.9993578,4.77533333 Z M4.65091743,3.38186667 L2.68866972,4.20693333 L4.82431193,5.1076 L6.79041284,4.27133333 L4.65091743,3.38186667 Z M11.3487615,3.3828 L9.20926606,4.27133333 L11.1744037,5.1076 L13.3100459,4.20693333 L11.3487615,3.3828 Z M7.9993578,1.9744 L5.8637156,2.87226667 L7.9993578,3.75893333 L10.135,2.87226667 L7.9993578,1.9744 Z"
    }
  />
);

export const HealthCollectorIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M11.5505371,2 C11.795997,2 12.0001455,2.1794987 12.0424814,2.41274791 L12.0505371,2.50262354 L12.0505371,4.00968327 L14.5009918,4.0016276 C14.7464517,4.0016276 14.9506002,4.17850276 14.9929362,4.41175197 L15.0009918,4.5016276 L15.0009918,13.4946832 C15.0009918,13.740143 14.8241167,13.9442915 14.5908675,13.9866275 L14.5009918,13.9946832 L1.51551649,13.9946832 C1.2700566,13.9946832 1.04233596,13.817808 1,13.5845588 L1,13.4946832 L1,4.5016276 C1,4.25616772 1.19239165,4.05201923 1.42564086,4.00968327 L1.51551649,4.0016276 L4.03869629,4.0016276 L4.03869629,2.49456787 C4.03869629,2.24910798 4.21557145,2.04233596 4.44882066,2 L4.53869629,2 L11.5505371,2 Z M14,5 L2,5 L2,13 L14,13 L14,5 Z M8.99720595,6 L8.99720595,8 L11,8 L11.001,10 L9,10 L9,12 L7,12 L7,10 L5,10 L5,8 L7,8 L7,6 L8.99720595,6 Z M11,3 L5,3 L5,4 L11,4 L11,3 Z"
    }
  />
);

export const DnsRouterIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M12.5128784,2 C13.0651632,2 13.5128784,2.44771525 13.5128784,3 C13.5128784,3.36968103 13.3122788,3.69250951 13.0139927,3.86557226 L13.0128784,6 L14,6 C14.5522847,6 15,6.44771525 15,7 L15,14 C15,14.5522847 14.5522847,15 14,15 L11,15 C10.4477153,15 10,14.5522847 10,14 L10,7 C10,6.44771525 10.4477153,6 11,6 L12.0128784,6 L12.0127489,3.86614288 C11.7457729,3.71165221 11.5568488,3.43726851 11.5196061,3.11662113 L11.5128784,3 C11.5128784,2.44771525 11.9605937,2 12.5128784,2 Z M14,7 L11,7 L11,14 L14,14 L14,7 Z M6,1 C8.4188915,1 10.4366008,2.71766536 10.8999437,4.99981203 L8.38898525,5.00010349 C8.46286772,5.33194988 8.5,5.66526981 8.5,6 C8.5,6.33506593 8.46279319,6.66871876 8.38876283,7.00089504 L8.999,7 L8.999,8.001 L8.05324268,8.00038412 C7.76198534,8.64879189 7.32931412,9.29122098 6.75815923,9.92718619 C7.64389187,9.75843713 8.42651693,9.29597186 9.00077532,8.64495116 L9.00019433,10.0002202 C8.16450051,10.6279975 7.12569317,11 6,11 C3.23857625,11 1,8.76142375 1,6 C1,3.23857625 3.23857625,1 6,1 Z M13,9 L13,10 L12,10 L12,9 L13,9 Z M4.09320393,8.00038412 L2.53577067,8.00110922 C3.13496598,9.0361732 4.18473754,9.77782157 5.4168251,9.95779409 C4.91453279,9.40381623 4.51821698,8.84531314 4.22892589,8.28227887 L4.09320393,8.00038412 Z M6.93388647,8.00070615 L5.21256014,8.00070615 C5.43348088,8.39445806 5.71969807,8.79140916 6.07232789,9.19174427 C6.42674854,8.79140916 6.71296573,8.39445806 6.93388647,8.00070615 Z M3.75746136,5.00010349 L2.12595483,5.00024347 C2.04373079,5.31979009 2,5.65478811 2,6 C2,6.34557375 2.04382251,6.6809122 2.12621352,7.00076134 L3.75768378,7.00089504 C3.68365342,6.66871876 3.64644661,6.33506593 3.64644661,6 C3.64644661,5.66526981 3.68357889,5.33194988 3.75746136,5.00010349 Z M7.35743594,5.00021726 L4.78901067,5.00021726 C4.69372823,5.33570745 4.64644661,5.66892866 4.64644661,6 C4.64644661,6.33140043 4.69382228,6.66495502 4.78929496,7.00078322 L7.35715165,7.00078322 C7.45262433,6.66495502 7.5,6.33140043 7.5,6 C7.5,5.66892866 7.45271838,5.33570745 7.35743594,5.00021726 Z M5.41541858,2.04272388 C4.17984983,2.22541543 3.13301451,2.9665169 2.53519846,3.99987956 L4.09275411,4.00061754 C4.34634286,3.43578117 4.7072409,2.87548137 5.17351131,2.32003887 L5.41541858,2.04272388 Z M6.75657878,2.07145157 L6.80113911,2.12097776 C7.35135412,2.74153782 7.76977799,3.36823444 8.0536925,4.00061754 L9.46480154,3.99987956 C8.89400171,3.01321612 7.91384929,2.2929953 6.75657878,2.07145157 Z M6.07411872,2.80825573 L5.89957016,3.01052492 C5.62473118,3.34273438 5.39575529,3.67262185 5.21199919,4.00029387 L6.93444742,4.00029387 C6.7134503,3.60621404 6.42704707,3.20892976 6.07411872,2.80825573 Z"
    }
  />
);

export const HttpRouterIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M13.5270386,2 C14.0793233,2 14.5270386,2.44771525 14.5270386,3 C14.5270386,3.36968103 14.2982861,3.69250951 14,3.86557226 L14,6 C14.5522847,6 15,6.44771525 15,7 L15,14 C15,14.5522847 14.5522847,15 14,15 L10,15 C9.44771525,15 9,14.5522847 9,14 L9,7 C9,6.44771525 9.44771525,6 10,6 L13,6 L13,3.86614288 C12.733024,3.71165221 12.571009,3.43726851 12.5337663,3.11662113 L12.5270386,3 C12.5270386,2.44771525 12.9747538,2 13.5270386,2 Z M14,7 L10,7 L10,14 L14,14 L14,7 Z M13,1 C13.0739203,1 13.1459673,1.00802053 13.2153182,1.02323882 C12.2582924,1.1744228 11.5270386,2.00181466 11.5270386,3 L11.5354262,3.17421416 L11.5631999,3.35845832 C11.6073476,3.59197961 11.6833241,3.80762974 11.788718,4.00090175 L2,4 L2,10 L8,10 L8,11 L2,11 C1.44771525,11 1,10.5522847 1,10 L1,2 C1,1.44771525 1.44771525,1 2,1 L13,1 Z M13,9 L13,10 L11,10 L11,9 L13,9 Z"
    }
  />
);

export const QnPlugIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={
      "M6,1 L6,4 L8.29979401,4 L9.99958801,4 L9.99958801,1 L11,1 L11,4 L11.8,4 C12.4627417,4 13,4.5372583 13,5.2 L13,8 C13,10.209139 11.209139,12 9,12 L8.6,12 L8.6,15 L7.4,15 L7.4,12 L7,12 C4.790861,12 3,10.209139 3,8 L3,5.2 C3,4.5372583 3.5372583,4 4.2,4 L5,4 L5,1 L6,1 Z M12,5 L4,5 L4,8 C4,9.59548928 5.22364512,10.9000774 6.76782296,10.994525 L6.94736842,11 L9.05263158,11 C10.6201298,11 11.9018304,9.75450408 11.994621,8.18275163 L12,8 L12,5 Z"
    }
  />
);

export const HttpRoutersGroupIcon = (props: IconProps) => (
  <SvgIcon
    {...props}
    path={[
      "M3.51287842,1 C4.06516317,1 4.51287842,1.44771525 4.51287842,2 C4.51287842,2.36968103 4.31227879,2.69250951 4.01399272,2.86557226 L4.01287842,5 L5,5 C5.14619302,5 5.28505894,5.03137105 5.41023319,5.08774858 C4.92380616,5.23856713 4.51734635,5.56824322 4.26760632,5.99992752 L2,6 L2,13 L4,13 L4,14 L2,14 C1.44771525,14 1,13.5522847 1,13 L1,6 C1,5.44771525 1.44771525,5 2,5 L3.01287842,5 L3.01274891,2.86614288 C2.74577288,2.71165221 2.55684884,2.43726851 2.51960615,2.11662113 L2.51287842,2 C2.51287842,1.44771525 2.96059367,1 3.51287842,1 Z M4,8 L4,9 L3,9 L3,8 L4,8 Z",
      "M7.52703857,2 C8.07932332,2 8.52703857,2.44771525 8.52703857,3 C8.52703857,3.36968103 8.29828608,3.69250951 8,3.86557226 L8,6 L9,6 C9.14619302,6 9.28505894,6.03137105 9.41023319,6.08774858 C8.92380616,6.23856713 8.51734635,6.56824322 8.26760632,6.99992752 L6,7 L6,14 L8,14 L8,15 L6,15 C5.44771525,15 5,14.5522847 5,14 L5,7 C5,6.44771525 5.44771525,6 6,6 L7,6 L7,3.86614288 C6.73302396,3.71165221 6.571009,3.43726851 6.53376631,3.11662113 L6.52703857,3 C6.52703857,2.44771525 6.97475382,2 7.52703857,2 Z M8,9 L8,10 L7,10 L7,9 L8,9 Z",
      "M11.5128784,3 C12.0651632,3 12.5128784,3.44771525 12.5128784,4 C12.5128784,4.36968103 12.3122788,4.69250951 12.0139927,4.86557226 L12.0128784,7 L13,7 C13.5522847,7 14,7.44771525 14,8 L14,15 C14,15.5522847 13.5522847,16 13,16 L10,16 C9.44771525,16 9,15.5522847 9,15 L9,8 C9,7.44771525 9.44771525,7 10,7 L11.0128784,7 L11.0127489,4.86614288 C10.7457729,4.71165221 10.5568488,4.43726851 10.5196061,4.11662113 L10.5128784,4 C10.5128784,3.44771525 10.9605937,3 11.5128784,3 Z M13,8 L10,8 L10,15 L13,15 L13,8 Z M12,10 L12,11 L11,11 L11,10 L12,10 Z",
    ]}
  />
);

export const MonitorIcon = ({ className, color = defaultIconColor }: IconProps) => (
  <Svg className={className}>
    <SvgGroup>
      <g id="522730" transform="translate(1.000000, 2.000000)" fill={color} fillRule="nonzero">
        <Path
          d={
            "M14,0 L14,12 L0,12 L0,0 L14,0 Z M13,1 L1,1 L1,11 L13,11 L13,1 Z M5.66666667,2.5 L8.33333333,7.29833984 L9.43328857,6 L12.0000229,6 L12.0000229,7 L9.99162292,7 L8.33333333,9.05090332 L5.66666667,4.8277162 L4.65948486,7 L2,7 L2,6 L4,6 L5.66666667,2.5 Z"
          }
        />
      </g>
    </SvgGroup>
  </Svg>
);

export const OfflineQnIcon = ({ className, color = defaultIconColor }: IconProps) => (
  <Svg className={className}>
    <SvgGroup>
      <g id="Group" transform="translate(1.000000, 2.000000)" fill={color} fillRule="nonzero">
        <Path d="M3.55271368e-15,2.84040821 L5.541,5.03140821 L5.541,11.9994082 L8.70353083e-05,9.79253085 L3.55271368e-15,2.84040821 Z M9.06198385,6.06779936 L9.17634016,6.13288674 L9.28021199,6.21966991 L10.9998819,7.9395 L12.7195518,6.21966991 C13.012445,5.9267767 13.4873188,5.9267767 13.780212,6.21966991 C14.0405615,6.48001944 14.0694892,6.88415604 13.8669952,7.17645825 L13.780212,7.28033009 L12.0603819,9 L13.780212,10.7196699 C14.0731052,11.0125631 14.0731052,11.4874369 13.780212,11.7803301 C13.5198625,12.0406796 13.1157259,12.0696073 12.8234236,11.8671133 L12.7195518,11.7803301 L10.9998819,10.0605 L9.28021199,11.7803301 C8.98731877,12.0732233 8.51244504,12.0732233 8.21955182,11.7803301 C7.95920229,11.5199806 7.93027456,11.115844 8.13276864,10.8235417 L8.21955182,10.7196699 L9.9393819,9 L8.21955182,7.28033009 C7.9266586,6.98743687 7.9266586,6.51256313 8.21955182,6.21966991 C8.44735765,5.99186408 8.78525047,5.94124056 9.06198385,6.06779936 Z M6.00044363,-4.08562073e-14 L11.221,2.18540821 L6.00044363,4.20818217 L0.83,2.16340821 L6.00044363,-4.08562073e-14 Z" />
      </g>
    </SvgGroup>
  </Svg>
);

export const UnreportedIcon = ({ className }: IconProps) => (
  <UnreportedSvg className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7802 5.55C18.7802 5.96938 18.7011 6.37157 18.5602 6.73938C20.5677 7.145 22.0802 8.92219 22.0802 11.05C22.0802 13.4803 20.1105 15.45 17.6802 15.45H5.0302C2.29739 15.45 0.0802002 13.2328 0.0802002 10.5C0.0802002 8.34125 1.46208 6.50563 3.38708 5.82844C3.38364 5.73563 3.3802 5.64282 3.3802 5.55C3.3802 2.51125 5.84145 0.0500031 8.8802 0.0500031C10.9186 0.0500031 12.6958 1.15688 13.648 2.80688C14.1705 2.45625 14.803 2.25 15.4802 2.25C17.3021 2.25 18.7802 3.72813 18.7802 5.55ZM15.3999 12.03C15.5688 11.861 15.5688 11.5878 15.3999 11.4188L13.0416 9.07852L15.4035 6.74179C15.5724 6.57282 15.5724 6.29961 15.4035 6.13064L13.9799 4.70704C13.8109 4.53807 13.5377 4.53807 13.3687 4.70704L11.0284 7.06534L8.69167 4.70344C8.52271 4.53448 8.24949 4.53448 8.08053 4.70344L6.65692 6.12705C6.48796 6.29601 6.48796 6.56923 6.65692 6.73819L9.01522 9.07852L6.65692 11.4152C6.48796 11.5842 6.48796 11.8574 6.65692 12.0264L8.07693 13.45C8.2459 13.619 8.51912 13.619 8.68808 13.45L11.0284 11.0917L13.3651 13.45C13.5341 13.619 13.8073 13.619 13.9763 13.45L15.3999 12.03Z"
      fill="currentColor"
    />
  </UnreportedSvg>
);

export const NoIspIcon = () => (
  <Svg>
    <defs>
      <linearGradient id="a" x1="25.746%" x2="50%" y1="91.294%" y2="19.085%">
        <stop offset="0%" stopColor="#FFF" stopOpacity=".2" />
        <stop offset="0%" stopColor="#FFF" stopOpacity=".5" />
        <stop offset="100%" stopColor="#FFF" />
      </linearGradient>
      <linearGradient id="b" x1="22.927%" x2="40.033%" y1="91.294%" y2="16.338%">
        <stop offset="0%" stopColor="#FFF" stopOpacity="0" />
        <stop offset="9.987%" stopColor="#FFF" stopOpacity=".5" />
        <stop offset="100%" stopColor="#FFF" />
      </linearGradient>
      <linearGradient id="c" x1="0%" x2="0%" y1="-2.719%" y2="106.069%">
        <stop offset="0%" stopColor="#73808B" stopOpacity=".1" />
        <stop offset="100%" stopColor="#73808B" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="scale(-1 1) rotate(-13 7.777 68.438)">
        <circle cx="6" cy="6" r="4" fill="#73808B" />
        <path stroke="url(#a)" d="M7 1a5 5 0 0 0-4.502 7.179" transform="rotate(-64 4.5 4.59)" />
        <path stroke="url(#b)" d="M6.935 1.14c-2.708.118-3.891 2.137-2.508 4.199" transform="rotate(-65 5.39 3.24)" />
      </g>
      <g transform="translate(0 1)">
        <ellipse cx="1.5" cy="7" fill="#73808B" rx="1.5" ry="2" />
        <path stroke="#73808B" d="M1 7a7 7 0 0 0 7 7" />
        <path stroke="url(#c)" d="M8 14c3.326 0 7-3.134 7-7a7 7 0 0 0-7-7" />
      </g>
    </g>
  </Svg>
);

export const ParcelIcon = ({ color = defaultIconColor }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={"18px"} height={"18px"} viewBox="0 0 16 16">
    <g fill="none" fillRule="evenodd">
      <g fill={color} fillRule="nonzero">
        <path d="M8.409 12.777c.519.19.786.763.597 1.282-.189.52-.762.787-1.281.598-.52-.19-.787-.763-.598-1.282.189-.519.763-.787 1.282-.598zm-2.35-.855c.26.095.394.382.3.641-.085.23-.32.362-.554.322l-.088-.023-3.758-1.368c-.26-.095-.394-.381-.3-.64.085-.232.32-.363.554-.323l.088.023 3.758 1.368zm1.925-6.749c.519.19.786.763.597 1.282l-1.368 3.759c-.189.519-.762.787-1.281.598l-3.76-1.368c-.518-.19-.786-.763-.597-1.282l1.368-3.759c.19-.519.763-.787 1.282-.598l3.759 1.368zm6.571-2.288c.056.239-.069.478-.286.573l-.086.028-2.617.617-2.644 7.265c-.084.23-.32.362-.554.322l-.087-.023c-.23-.084-.362-.32-.322-.554l.023-.087 2.828-7.771 3.144-.742c.268-.063.538.103.601.372zM7.642 6.113l-3.76-1.368-1.367 3.759 3.759 1.368 1.368-3.759z" />
      </g>
    </g>
  </svg>
);

export const OldParcelIcon = ({ color = defaultIconColor }: IconProps) => (
  <svg height={"18px"} width={"18px"} viewBox={"0 0 18 18"}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.19764 0.950628L6.94281 0.695801L6.62048 0.856968L0.620476 3.85697L0 4.16721L0.49053 4.65774L2.13698 6.30418L0.490529 7.95062L0.0318987 8.40925L0.592147 8.73607L2.34408 9.75803V14.3053L2.35022 14.3811C2.37447 14.5296 2.46887 14.6564 2.60238 14.7125L8.69649 17.2743L8.76931 17.2967C8.84343 17.3117 8.92049 17.3042 8.99167 17.2743L15.0858 14.7125L15.1491 14.6788C15.2687 14.6005 15.3441 14.4597 15.3441 14.3053V9.67975L17.0811 8.74441L17.6728 8.42581L17.1976 7.95062L15.506 6.25901L16.9909 4.30224L17.3682 3.80498L16.8006 3.54531L10.924 0.857026L10.5975 0.70765L10.3516 0.969353L8.83288 2.58587L7.19764 0.950628ZM14.2181 10.2861L10.5811 12.2444L10.1609 12.4707L9.91534 12.0614L9.33662 11.0969L9.35743 15.7922L9.35725 16.2255L14.2181 14.0066V10.3661V10.2861ZM8.33243 10.7441L7.23452 12.1165L6.96492 12.4535L6.59215 12.2361L3.21809 10.2679V14.0066L8.34988 16.214L8.33243 10.7441ZM1.65627 8.1991L2.94281 6.91256L8.06728 9.4748L6.72324 11.1548L1.65627 8.1991ZM13.5206 6.40688L8.84408 8.74517L4.04727 6.34675L8.71851 4.21288L13.5206 6.40688ZM8 3.16721L2.94281 5.6958L1.68817 4.44116L6.74536 1.91256L8 3.16721ZM14.6966 5.67141L9.6682 3.15722L10.8345 1.91577L15.8169 4.195L14.6966 5.67141ZM14.2181 7.17619L14.7454 6.91256L16.0153 8.18254L14.2181 9.1503L10.5273 11.1377L9.55062 9.50993L14.2181 7.17619Z"
      fill={color}
    />
  </svg>
);
