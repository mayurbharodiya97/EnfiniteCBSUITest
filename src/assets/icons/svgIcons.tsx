export const HeaderNotificationSvg = (props) => {
  const { dotColor, height, width, stroke } = props;
  const svgCode = `
    <svg  width=${width} height=${height} viewBox="0 0 58 65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.1603 13.25L23.1605 13.25L36.2162 13.25L36.2164 13.25C38.6662 13.2497 40.9901 14.0864 42.7206 15.54C44.4452 16.9886 45.4381 18.924 45.5788 20.93L46.5053 34.1819C46.5053 34.1819 46.5053 34.182 46.5053 34.182C46.8963 39.7762 48.7592 45.1794 51.9059 49.9581L38.8713 51.3588C32.7703 52.0112 26.6075 52.0112 20.5065 51.3589C20.5061 51.3589 20.5058 51.3589 20.5054 51.3588L7.47136 49.9581C10.6191 45.1797 12.4833 39.7768 12.8755 34.1824L12.8756 34.1814L13.7979 20.93C13.7979 20.9297 13.7979 20.9294 13.798 20.9291C13.798 20.929 13.798 20.9289 13.798 20.9289C13.939 18.9232 14.9318 16.9883 16.6561 15.54C18.3866 14.0864 20.7105 13.2497 23.1603 13.25ZM4.59985 51.2254L4.2813 50.9775L4.66661 51.2774L4.61814 51.2397L4.60604 51.2302L4.59985 51.2254Z" stroke=${stroke} stroke-width="4">
                                        <animate attributeName="d" values="M23.1603 13.25L23.1605 13.25L36.2162 13.25L36.2164 13.25C38.6662 13.2497 40.9901 14.0864 42.7206 15.54C44.4452 16.9886 45.4381 18.924 45.5788 20.93L46.5053 34.1819C46.5053 34.1819 46.5053 34.182 46.5053 34.182C46.8963 39.7762 48.7592 45.1794 51.9059 49.9581L38.8713 51.3588C32.7703 52.0112 26.6075 52.0112 20.5065 51.3589C20.5061 51.3589 20.5058 51.3589 20.5054 51.3588L7.47136 49.9581C10.6191 45.1797 12.4833 39.7768 12.8755 34.1824L12.8756 34.1814L13.7979 20.93C13.7979 20.9297 13.7979 20.9294 13.798 20.9291C13.798 20.929 13.798 20.9289 13.798 20.9289C13.939 18.9232 14.9318 16.9883 16.6561 15.54C18.3866 14.0864 20.7105 13.2497 23.1603 13.25ZM4.59985 51.2254L4.2813 50.9775L4.66661 51.2774L4.61814 51.2397L4.60604 51.2302L4.59985 51.2254Z;M18.9288 15.2489L18.929 15.2488L31.6403 12.2698L31.6405 12.2698C34.0256 11.7105 36.4791 11.9949 38.4956 13.0153C40.5051 14.032 41.9133 15.6897 42.5082 17.6104C42.5082 17.6106 42.5083 17.6108 42.5083 17.6109L46.4341 30.3019C48.0912 35.6594 51.1379 40.4949 55.292 44.4295L42.9208 48.7675C42.9206 48.7676 42.9204 48.7677 42.9202 48.7678C42.9201 48.7678 42.92 48.7678 42.9198 48.7679C37.1289 50.7949 31.1291 52.201 25.0405 52.958C25.0401 52.9581 25.0398 52.9581 25.0394 52.9582L12.0296 54.5684C14.004 49.1979 14.5862 43.5121 13.6916 37.9758L13.6914 37.9748L11.5658 24.8625C11.5657 24.8622 11.5657 24.8619 11.5656 24.8616C11.5656 24.8616 11.5656 24.8615 11.5656 24.8614C11.2453 22.8765 11.7704 20.7661 13.1187 18.9625C14.4719 17.1525 16.5436 15.8076 18.9288 15.2489ZM9.53013 56.4608L9.54406 56.4672L9.53013 56.4608Z;M28.031 12.2434L28.0312 12.2435L40.6982 15.4057L40.6984 15.4058C43.0753 15.9989 45.1274 17.3735 46.4543 19.2029C47.7765 21.026 48.2711 23.144 47.9219 25.1243C47.9219 25.1244 47.9219 25.1246 47.9218 25.1248L45.611 38.2065C44.6353 43.7289 45.1341 49.4224 47.0296 54.821L34.0438 53.0229C34.0436 53.0229 34.0434 53.0228 34.0432 53.0228C34.0431 53.0228 34.0429 53.0228 34.0428 53.0228C27.9658 52.1779 21.9869 50.6853 16.2258 48.5748C16.2255 48.5747 16.2251 48.5746 16.2248 48.5745L3.91814 44.0585C8.12954 40.1848 11.2469 35.3942 12.9824 30.0614L12.9828 30.0605L17.0872 17.4271C17.0873 17.4268 17.0874 17.4265 17.0875 17.4262C17.0875 17.4261 17.0875 17.4261 17.0876 17.426C17.7102 15.5143 19.1421 13.8774 21.1658 12.8898C23.1969 11.8987 25.6542 11.6498 28.031 12.2434ZM0.830014 44.5987L0.839473 44.6108L0.830014 44.5987Z;M18.9288 15.2489L18.929 15.2488L31.6403 12.2698L31.6405 12.2698C34.0256 11.7105 36.4791 11.9949 38.4956 13.0153C40.5051 14.032 41.9133 15.6897 42.5082 17.6104C42.5082 17.6106 42.5083 17.6108 42.5083 17.6109L46.4341 30.3019C48.0912 35.6594 51.1379 40.4949 55.292 44.4295L42.9208 48.7675C42.9206 48.7676 42.9204 48.7677 42.9202 48.7678C42.9201 48.7678 42.92 48.7678 42.9198 48.7679C37.1289 50.7949 31.1291 52.201 25.0405 52.958C25.0401 52.9581 25.0398 52.9581 25.0394 52.9582L12.0296 54.5684C14.004 49.1979 14.5862 43.5121 13.6916 37.9758L13.6914 37.9748L11.5658 24.8625C11.5657 24.8622 11.5657 24.8619 11.5656 24.8616C11.5656 24.8616 11.5656 24.8615 11.5656 24.8614C11.2453 22.8765 11.7704 20.7661 13.1187 18.9625C14.4719 17.1525 16.5436 15.8076 18.9288 15.2489ZM9.53013 56.4608L9.54406 56.4672L9.53013 56.4608Z;M23.1603 13.25L23.1605 13.25L36.2162 13.25L36.2164 13.25C38.6662 13.2497 40.9901 14.0864 42.7206 15.54C44.4452 16.9886 45.4381 18.924 45.5788 20.93L46.5053 34.1819C46.5053 34.1819 46.5053 34.182 46.5053 34.182C46.8963 39.7762 48.7592 45.1794 51.9059 49.9581L38.8713 51.3588C32.7703 52.0112 26.6075 52.0112 20.5065 51.3589C20.5061 51.3589 20.5058 51.3589 20.5054 51.3588L7.47136 49.9581C10.6191 45.1797 12.4833 39.7768 12.8755 34.1824L12.8756 34.1814L13.7979 20.93C13.7979 20.9297 13.7979 20.9294 13.798 20.9291C13.798 20.929 13.798 20.9289 13.798 20.9289C13.939 18.9232 14.9318 16.9883 16.6561 15.54C18.3866 14.0864 20.7105 13.2497 23.1603 13.25ZM4.59985 51.2254L4.2813 50.9775L4.66661 51.2774L4.61814 51.2397L4.60604 51.2302L4.59985 51.2254Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></path>
    <path d="M22.5391 52.5C22.5391 53.7519 22.65 55.0006 22.8703 56.1791C23.0898 57.3541 23.4192 58.4658 23.8594 59.4416C24.2944 60.406 24.8642 61.2962 25.5963 61.9683C26.3412 62.6523 27.3108 63.1539 28.4429 63.1539C29.575 63.1539 30.5446 62.6523 31.2895 61.9683C32.0216 61.2962 32.5914 60.406 33.0264 59.4416C33.4666 58.4658 33.796 57.3541 34.0156 56.1791C34.2358 55.0006 34.3468 53.7519 34.3468 52.5" stroke=${stroke} stroke-width="4">
                                        <animate attributeName="d" values="M22.5391 52.5C22.5391 53.7519 22.65 55.0006 22.8703 56.1791C23.0898 57.3541 23.4192 58.4658 23.8594 59.4416C24.2944 60.406 24.8642 61.2962 25.5963 61.9683C26.3412 62.6523 27.3108 63.1539 28.4429 63.1539C29.575 63.1539 30.5446 62.6523 31.2895 61.9683C32.0216 61.2962 32.5914 60.406 33.0264 59.4416C33.4666 58.4658 33.796 57.3541 34.0156 56.1791C34.2358 55.0006 34.3468 53.7519 34.3468 52.5;M33.8078 53.2577C34.1805 54.4528 34.6582 55.6118 35.2193 56.6713C35.7787 57.7277 36.4242 58.691 37.1349 59.4915C37.8373 60.2826 38.6463 60.9627 39.5453 61.3864C40.4601 61.8176 41.535 62.0078 42.6158 61.6707C43.6966 61.3337 44.4729 60.5662 44.9804 59.6914C45.4791 58.8318 45.7581 57.8123 45.8863 56.7622C46.016 55.6996 45.9994 54.5402 45.8592 53.3531C45.7185 52.1625 45.4527 50.9374 45.08 49.7423;M13.892 49.4683C13.5115 50.698 13.2375 51.9569 13.0885 53.1784C12.9399 54.3962 12.9149 55.5828 13.0359 56.6674C13.1554 57.7383 13.4247 58.7773 13.9153 59.6522C14.4138 60.5416 15.1908 61.3361 16.2944 61.6775C17.3979 62.019 18.4879 61.8021 19.4016 61.3497C20.3005 60.9047 21.1095 60.1994 21.8129 59.3831C22.5253 58.5563 23.1748 57.563 23.74 56.474C24.3068 55.3818 24.7916 54.1882 25.1721 52.9584;M33.8078 53.2577C34.1805 54.4528 34.6582 55.6118 35.2193 56.6713C35.7787 57.7277 36.4242 58.691 37.1349 59.4915C37.8373 60.2826 38.6463 60.9627 39.5453 61.3864C40.4601 61.8176 41.535 62.0078 42.6158 61.6707C43.6966 61.3337 44.4729 60.5662 44.9804 59.6914C45.4791 58.8318 45.7581 57.8123 45.8863 56.7622C46.016 55.6996 45.9994 54.5402 45.8592 53.3531C45.7185 52.1625 45.4527 50.9374 45.08 49.7423;M22.5391 52.5C22.5391 53.7519 22.65 55.0006 22.8703 56.1791C23.0898 57.3541 23.4192 58.4658 23.8594 59.4416C24.2944 60.406 24.8642 61.2962 25.5963 61.9683C26.3412 62.6523 27.3108 63.1539 28.4429 63.1539C29.575 63.1539 30.5446 62.6523 31.2895 61.9683C32.0216 61.2962 32.5914 60.406 33.0264 59.4416C33.4666 58.4658 33.796 57.3541 34.0156 56.1791C34.2358 55.0006 34.3468 53.7519 34.3468 52.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="stroke" values=${stroke} begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></path>
    <path d="M29.3477 10.0947L29.3805 8.94147" stroke=${stroke} stroke-width="6" stroke-linecap="round">
                                        <animate attributeName="stroke-width" values="6;5;5;5;6" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></path>
    <path d="M32.2076 15.443C30.2895 13.233 30.4824 9.96326 32.588 8.13579C34.6936 6.30832 37.958 6.57757 39.876 8.78754C41.7941 10.9975 41.6012 14.2673 39.4956 16.0947C37.3899 17.9222 34.1256 17.653 32.2076 15.443Z" fill=${dotColor} stroke=${dotColor}>
                                        <animate attributeName="d" values="M32.2076 15.443C30.2895 13.233 30.4824 9.96326 32.588 8.13579C34.6936 6.30832 37.958 6.57757 39.876 8.78754C41.7941 10.9975 41.6012 14.2673 39.4956 16.0947C37.3899 17.9222 34.1256 17.653 32.2076 15.443Z;M38.8937 7.91595C41.3142 9.56026 41.9661 12.7702 40.3995 15.0764C38.8328 17.3827 35.6085 17.9594 33.188 16.3151C30.7674 14.6708 30.1155 11.4609 31.6822 9.15461C33.2488 6.84836 36.4731 6.27163 38.8937 7.91595Z;M40.0005 8.93853C41.8315 11.2211 41.5121 14.481 39.3373 16.2255C37.1625 17.97 33.911 17.5745 32.08 15.2919C30.249 13.0093 30.5684 9.74949 32.7432 8.00496C34.9181 6.26043 38.1695 6.65592 40.0005 8.93853Z;M38.8937 7.91595C41.3142 9.56026 41.9661 12.7702 40.3995 15.0764C38.8328 17.3827 35.6085 17.9594 33.188 16.3151C30.7674 14.6708 30.1155 11.4609 31.6822 9.15461C33.2488 6.84836 36.4731 6.27163 38.8937 7.91595Z;M32.2076 15.443C30.2895 13.233 30.4824 9.96326 32.588 8.13579C34.6936 6.30832 37.958 6.57757 39.876 8.78754C41.7941 10.9975 41.6012 14.2673 39.4956 16.0947C37.3899 17.9222 34.1256 17.653 32.2076 15.443Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></path>
    <defs>
    <linearGradient id="paint0_linear_593_3433" x1="29.6884" y1="11.25" x2="48.4361" y2="70.7798" gradientUnits="userSpaceOnUse">
    <stop stop-color="#2B4BAB">
                                        <animate attributeName="stop-color" values="#2B4BAB;#2C4CAC;#2C4CAC;#2C4CAC;#2B4BAB" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></stop>
    <stop offset="1" stop-color="#4263C7">
                                        <animate attributeName="stop-color" values="#4263C7;#3A5ABC;#3959BA;#3A5ABC;#4263C7" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></stop>
    
                                        
                                        <animate attributeName="x1" values="29.6884;24.8283;34.8491;24.8283;29.6884" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y1" values="11.25;11.8121;11.8842;11.8121;11.25" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="x2" values="48.4361;47.9476;37.2064;47.9476;48.4361" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y2" values="70.7798;51.6286;57.8657;51.6286;70.7798" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></linearGradient>
    <linearGradient id="paint1_linear_593_3433" x1="39.8233" y1="16.4724" x2="32.2603" y2="7.75818" gradientUnits="userSpaceOnUse">
    <stop stop-color="#DD0404"/>
    <stop offset="1" stop-color="#990000"/>
    
                                        
                                        <animate attributeName="x1" values="39.8233;31.2686;32.4304;31.2686;39.8233" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y1" values="16.4724;8.87365;7.61493;8.87365;16.4724" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="x2" values="32.2603;40.8131;39.6501;40.8131;32.2603" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y2" values="7.75818;15.3574;16.6155;15.3574;7.75818" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></linearGradient>
    <linearGradient id="paint2_linear_593_3433" x1="37.9657" y1="16.5568" x2="35.2157" y2="10.3368" gradientUnits="userSpaceOnUse">
    <stop stop-color="#CD0303"/>
    <stop offset="1" stop-color="#EBEDEE"/>
    
                                        
                                        <animate attributeName="x1" values="37.9657;33.0424;34.2898;33.0424;37.9657" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y1" values="16.5568;8.31578;7.60255;8.31578;16.5568" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="x2" values="35.2157;37.2953;36.7969;37.2953;35.2157" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/>
                                        <animate attributeName="y2" values="10.3368;13.6227;13.9243;13.6227;10.3368" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.146;0.5;0.854;1"/></linearGradient>
    </defs>
    </svg>
    `;
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
export const AlertMessageBox = (props) => {
  const { dotColor, height, width, stroke } = props;
  const svgCode = `
  <svg width=${width} height=${height} viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M26.5195 2.45081C26.2102 1.77236 25.7206 1.18725 25.1017 0.756269C24.4827 0.325285 23.757 0.0641525 22.9999 0C22.2468 0.0680032 21.5259 0.330914 20.9113 0.761675C20.2968 1.19244 19.8107 1.77548 19.5033 2.45081L0.823886 34.0641C-1.10846 37.3243 0.478822 40 4.32052 40L41.6793 40C45.521 40 47.1082 37.3243 45.1759 34.0641L26.5195 2.45081Z" fill="#FF4F79">
                                      <animate attributeName="d" values="M26.5195 2.45081C26.2102 1.77236 25.7206 1.18725 25.1017 0.756269C24.4827 0.325285 23.757 0.0641525 22.9999 0C22.2468 0.0680032 21.5259 0.330914 20.9113 0.761675C20.2968 1.19244 19.8107 1.77548 19.5033 2.45081L0.823886 34.0641C-1.10846 37.3243 0.478822 40 4.32052 40L41.6793 40C45.521 40 47.1082 37.3243 45.1759 34.0641L26.5195 2.45081Z;M26.5195 2.45081C26.2102 1.77236 25.7206 1.18725 25.1017 0.756269C24.4827 0.325285 23.757 0.0641525 22.9999 0C22.2468 0.0680032 21.5259 0.330914 20.9113 0.761675C20.2968 1.19244 19.8107 1.77548 19.5033 2.45081L0.823886 34.0641C-1.10846 37.3243 0.478822 40 4.32052 40L41.6793 40C45.521 40 47.1082 37.3243 45.1759 34.0641L26.5195 2.45081Z;M26.5196 2.45081C26.2103 1.77236 25.7207 1.18725 25.1018 0.756269C24.4828 0.325285 23.7571 0.0641525 23 0C22.2469 0.0680032 21.526 0.330914 20.9115 0.761675C20.2969 1.19244 19.8108 1.77548 19.5034 2.45081L0.823999 34.0641C-1.10835 37.3243 0.478935 40 4.32063 40L33.5 34.0641C37.3417 34.0641 40.753 31.3884 38.8206 28.1282L26.5196 2.45081Z;M19.5435 2.45081C19.2341 1.77236 18.7446 1.18725 18.1256 0.756269C17.5067 0.325285 16.781 0.0641525 16.0239 0C15.2708 0.0680032 14.5499 0.330914 13.9353 0.761675C13.3208 1.19244 12.8347 1.77548 12.5272 2.45081L0.97439 26.5C-0.957959 29.7603 0.629326 32.4359 4.47102 32.4359L34.7032 40C38.5449 40 40.1322 37.3243 38.1998 34.0641L19.5435 2.45081Z;M26.5196 2.45081C26.2103 1.77236 25.7207 1.18725 25.1018 0.756269C24.4828 0.325285 23.7571 0.0641525 23 0C22.2469 0.0680032 21.526 0.330914 20.9115 0.761675C20.2969 1.19244 19.8108 1.77548 19.5034 2.45081L0.823999 34.0641C-1.10835 37.3243 0.478935 40 4.32063 40L33.5 34.0641C37.3417 34.0641 40.753 31.3884 38.8206 28.1282L26.5196 2.45081Z;M26.5195 2.45081C26.2102 1.77236 25.7206 1.18725 25.1017 0.756269C24.4827 0.325285 23.757 0.0641525 22.9999 0C22.2468 0.0680032 21.5259 0.330914 20.9113 0.761675C20.2968 1.19244 19.8107 1.77548 19.5033 2.45081L0.823886 34.0641C-1.10846 37.3243 0.478822 40 4.32052 40L41.6793 40C45.521 40 47.1082 37.3243 45.1759 34.0641L26.5195 2.45081Z;M26.5195 2.45081C26.2102 1.77236 25.7206 1.18725 25.1017 0.756269C24.4827 0.325285 23.757 0.0641525 22.9999 0C22.2468 0.0680032 21.5259 0.330914 20.9113 0.761675C20.2968 1.19244 19.8107 1.77548 19.5033 2.45081L0.823886 34.0641C-1.10846 37.3243 0.478822 40 4.32052 40L41.6793 40C45.521 40 47.1082 37.3243 45.1759 34.0641L26.5195 2.45081Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/></path>
  <rect x="21" y="9" width="4" height="19" fill="white">
                                      <animate attributeName="height" values="19;15.96;14.44;14.44;14.44;15.96;19" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/>
                                      <animate attributeName="x" values="21;21;21;14.0234;21;21;21" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/></rect>
  <rect x="21" y="30" width="4" height="4" fill="white">
                                      <animate attributeName="y" values="30;26.6406;24.9609;24.9609;24.9609;26.6406;30" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/>
                                      <animate attributeName="height" values="4;3.36;3.04;3.04;3.04;3.36;4" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/>
                                      <animate attributeName="x" values="21;21;21;14.0234;21;21;21" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.167;0.333;0.5;0.667;0.833;1"/></rect>
  </svg>
    `;
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
export const TipsMessageBox = (props) => {
  const { dotColor, height, width, stroke } = props;
  const svgCode = `
  <svg width=${width} height=${height} viewBox="0 0 68 61" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.7781 53L12.2219 53C11.504 53 11.1963 53.9115 11.7674 54.3466L20.0455 60.6537C20.314 60.8583 20.686 60.8583 20.9545 60.6537L29.2326 54.3466C29.8036 53.9115 29.496 53 28.7781 53Z" fill="#4B28A0">
                                    <animate attributeName="d" values="M28.7781 53L12.2219 53C11.504 53 11.1963 53.9115 11.7674 54.3466L20.0455 60.6537C20.314 60.8583 20.686 60.8583 20.9545 60.6537L29.2326 54.3466C29.8036 53.9115 29.496 53 28.7781 53Z;M17.0274 47L11.9726 47C11.283 47 10.9589 47.8524 11.4744 48.3106L14.0017 50.5571C14.2859 50.8097 14.7141 50.8097 14.9983 50.5571L17.5256 48.3106C18.0411 47.8524 17.717 47 17.0274 47Z;M28.7781 53L12.2219 53C11.504 53 11.1963 53.9115 11.7674 54.3466L20.0455 60.6537C20.314 60.8583 20.686 60.8583 20.9545 60.6537L29.2326 54.3466C29.8036 53.9115 29.496 53 28.7781 53Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
<rect x="9" y="47" width="23" height="4" rx="0.755" fill="url(#paint0_linear_866_3608)">
                                    <animate attributeName="y" values="47;41;47" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="width" values="23;11;23" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></rect>
<g filter="url(#filter0_d_866_3608)">
<path d="M48 0L45 8L37 11L45 14L48 22L51 14L59 11L51 8L48 0Z" fill="url(#paint1_linear_866_3608)">
                                    <animate attributeName="d" values="M48 0L45 8L37 11L45 14L48 22L51 14L59 11L51 8L48 0Z;M40 0L38.3636 4L34 5.5L38.3636 7L40 11L41.6364 7L46 5.5L41.6364 4L40 0Z;M48 0L45 8L37 11L45 14L48 22L51 14L59 11L51 8L48 0Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
</g>
<g filter="url(#filter1_d_866_3608)">
<path d="M62 18L60.3636 22L56 23.5L60.3636 25L62 29L63.6364 25L68 23.5L63.6364 22L62 18Z" fill="url(#paint2_linear_866_3608)">
                                    <animate attributeName="d" values="M62 18L60.3636 22L56 23.5L60.3636 25L62 29L63.6364 25L68 23.5L63.6364 22L62 18Z;M55.5 4L52.3636 11.6364L44 14.5L52.3636 17.3636L55.5 25L58.6364 17.3636L67 14.5L58.6364 11.6364L55.5 4Z;M62 18L60.3636 22L56 23.5L60.3636 25L62 29L63.6364 25L68 23.5L63.6364 22L62 18Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
</g>
<path d="M19 43.3365L18.9873 43.3365L18.9746 43.3367L9.77304 43.4926C6.52194 41.377 4.047 38.3555 2.68276 34.8516C1.26832 31.2188 1.11868 27.2509 2.25446 23.5323C3.39057 19.8126 5.75641 16.5286 9.01562 14.176C12.2758 11.8226 16.2523 10.5303 20.3553 10.5005C24.4582 10.4708 28.4553 11.7054 31.753 14.0116C35.0498 16.3171 37.468 19.567 38.6632 23.2702C39.8581 26.9724 39.7714 30.9419 38.4151 34.5944C37.1067 38.1175 34.6801 41.1743 31.463 43.3365L19 43.3365Z" stroke="url(#paint3_linear_866_3608)" stroke-width="3">
                                    <animate attributeName="d" values="M19 43.3365L18.9873 43.3365L18.9746 43.3367L9.77304 43.4926C6.52194 41.377 4.047 38.3555 2.68276 34.8516C1.26832 31.2188 1.11868 27.2509 2.25446 23.5323C3.39057 19.8126 5.75641 16.5286 9.01562 14.176C12.2758 11.8226 16.2523 10.5303 20.3553 10.5005C24.4582 10.4708 28.4553 11.7054 31.753 14.0116C35.0498 16.3171 37.468 19.567 38.6632 23.2702C39.8581 26.9724 39.7714 30.9419 38.4151 34.5944C37.1067 38.1175 34.6801 41.1743 31.463 43.3365L19 43.3365Z;M13.439 37.3774L13.4255 37.3774L13.4121 37.3776L7.06262 37.4917C4.89942 35.9618 3.2412 33.7969 2.31696 31.2798C1.34017 28.6197 1.23637 25.7108 2.02131 22.9858C2.8062 20.2609 4.43688 17.8683 6.66762 16.1609C8.89805 14.4538 11.6102 13.5218 14.4015 13.5004C17.1927 13.4789 19.9184 14.3691 22.174 16.0416C24.43 17.7145 26.0962 20.0816 26.9219 22.7939C27.7475 25.5065 27.6874 28.4167 26.7506 31.0916C25.8639 33.6234 24.2375 35.8142 22.0965 37.3774L13.439 37.3774Z;M19 43.3365L18.9873 43.3365L18.9746 43.3367L9.77304 43.4926C6.52194 41.377 4.047 38.3555 2.68276 34.8516C1.26832 31.2188 1.11868 27.2509 2.25446 23.5323C3.39057 19.8126 5.75641 16.5286 9.01562 14.176C12.2758 11.8226 16.2523 10.5303 20.3553 10.5005C24.4582 10.4708 28.4553 11.7054 31.753 14.0116C35.0498 16.3171 37.468 19.567 38.6632 23.2702C39.8581 26.9724 39.7714 30.9419 38.4151 34.5944C37.1067 38.1175 34.6801 41.1743 31.463 43.3365L19 43.3365Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
<defs>
<filter id="filter0_d_866_3608" x="33" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.67226 0 0 0 0 0.545618 0 0 0 0 0.992197 0 0 0 0.5 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_866_3608">
                                    </feBlend>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_866_3608" result="shape">
                                    </feBlend>

                                    
                                    <animate attributeName="x" values="33;30;33" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="width" values="30;20;30" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="height" values="30;19;30" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></filter>
<filter id="filter1_d_866_3608" x="52" y="18" width="20" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.67226 0 0 0 0 0.545618 0 0 0 0 0.992197 0 0 0 0.5 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_866_3608">
                                    </feBlend>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_866_3608" result="shape">
                                    </feBlend>

                                    
                                    <animate attributeName="x" values="52;40;52" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y" values="18;4;18" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="width" values="20;31;20" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="height" values="19;29;19" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></filter>
<linearGradient id="paint0_linear_866_3608" x1="20" y1="44.5" x2="20.5" y2="51" gradientUnits="userSpaceOnUse">
<stop stop-color="#885CF5"/>
<stop offset="1" stop-color="#4B29A0"/>

                                    
                                    <animate attributeName="x1" values="20;9;20" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="44.5;36;44.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="20.5;17.0009;20.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="51;40.9905;51" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
<linearGradient id="paint1_linear_866_3608" x1="48" y1="0" x2="48" y2="22" gradientUnits="userSpaceOnUse">
<stop stop-color="#885CF5"/>
<stop offset="1" stop-color="#40208F"/>

                                    
                                    <animate attributeName="x1" values="48;37.5;48" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="0;4.5;0" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="48;43.5;48" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="22;2;22" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
<linearGradient id="paint2_linear_866_3608" x1="62" y1="18" x2="61" y2="27" gradientUnits="userSpaceOnUse">
<stop stop-color="#8156EB"/>
<stop offset="1" stop-color="#4A289E"/>

                                    
                                    <animate attributeName="x1" values="62;47.0263;62" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="18;16.3529;18" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="61;77.8895;61" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="27;13.819;27" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
<linearGradient id="paint3_linear_866_3608" x1="12.5" y1="8.5" x2="32" y2="45" gradientUnits="userSpaceOnUse">
<stop stop-color="#885CF5"/>
<stop offset="1" stop-color="#49279D"/>

                                    
                                    <animate attributeName="x1" values="12.5;8.84146;12.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="8.5;11.625;8.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="32;-13.6486;32" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="45;29.096;45" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
</defs>
</svg>
    `;
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
export const NotesMessageBox = (props) => {
  const { dotColor, height, width, stroke } = props;
  const svgCode = `
  <svg width=${width} height=${height} viewBox="0 0 46 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.998047" width="33.002" height="41" fill="#FBFBFC">
                                      <animate attributeName="x" values="0.998047;0;0.998047" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></rect>
  <path d="M28.5 0.50014L1.45898 0.50014L1.45898 40.5L33.5442 40.5L33.5442 26.5" stroke="#5290F5" stroke-linecap="round">
                                      <animate attributeName="d" values="M28.5 0.50014L1.45898 0.50014L1.45898 40.5L33.5442 40.5L33.5442 26.5;M27.502 0.50014L0.460938 0.50014L0.460938 40.5L32.5462 40.5L32.5462 26.5;M28.5 0.50014L1.45898 0.50014L1.45898 40.5L33.5442 40.5L33.5442 26.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 9L29 9" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 9L29 9;M7.00195 10L26 10;M6 9L29 9" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 15.5723L29 15.5723" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 15.5723L29 15.5723;M7.00195 16L26 16;M6 15.5723L29 15.5723" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 18.8574L29 18.8574" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 18.8574L29 18.8574;M7.00195 19L26 19;M6 18.8574L29 18.8574" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 25.4277L29 25.4277" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 25.4277L29 25.4277;M7.00195 25L26 25;M6 25.4277L29 25.4277" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 12.2852L21.3333 12.2852" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 12.2852L21.3333 12.2852;M7.00195 13L19.6673 13;M6 12.2852L21.3333 12.2852" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M13.0762 28.7148L28.9992 28.7148" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M13.0762 28.7148L28.9992 28.7148;M12.8477 28L26.0001 28;M13.0762 28.7148L28.9992 28.7148" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 22.1426L21.3333 22.1426" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 22.1426L21.3333 22.1426;M7.00195 22L19.6673 22;M6 22.1426L21.3333 22.1426" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 32L21.3333 32" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 32L21.3333 32;M7.00195 31L19.6673 31;M6 32L21.3333 32" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M22.5117 22.1426L28.9989 22.1426" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M22.5117 22.1426L28.9989 22.1426;M20.6406 22L25.999 22;M22.5117 22.1426L28.9989 22.1426" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M6 28.7148L12.4872 28.7148" stroke="#949597" stroke-width="0.35" stroke-linecap="round">
                                      <animate attributeName="d" values="M6 28.7148L12.4872 28.7148;M7.00195 28L12.3604 28;M6 28.7148L12.4872 28.7148" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                      <animate attributeName="stroke" values="#949597;#4263C7;#949597" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <path d="M31.2673 0L36.495 0L36.495 9.69231L46 9.69231L46 14.3077L36.495 14.3077L36.495 24L31.2673 24L31.2673 14.0769L22 14.0769L22 9.69231L31.2673 9.69231L31.2673 0Z" fill="url(#paint0_radial_872_3789)">
                                      <animate attributeName="d" values="M31.2673 0L36.495 0L36.495 9.69231L46 9.69231L46 14.3077L36.495 14.3077L36.495 24L31.2673 24L31.2673 14.0769L22 14.0769L22 9.69231L31.2673 9.69231L31.2673 0Z;M31.6337 4L34.2475 4L34.2475 8.84615L39 8.84615L39 11.1538L34.2475 11.1538L34.2475 16L31.6337 16L31.6337 11.0385L27 11.0385L27 8.84615L31.6337 8.84615L31.6337 4Z;M31.2673 0L36.495 0L36.495 9.69231L46 9.69231L46 14.3077L36.495 14.3077L36.495 24L31.2673 24L31.2673 14.0769L22 14.0769L22 9.69231L31.2673 9.69231L31.2673 0Z" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
  <defs>
  <radialGradient id="paint0_radial_872_3789" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(34 12) rotate(-39.4725) scale(12.5844)">
  <stop stop-color="#5290F5"/>
  <stop offset="1" stop-color="#0651CC"/>
  
                                      </radialGradient>
  </defs>
  </svg>
    `;
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
export const AnnouncementMessageBox = (props) => {
  const { dotColor, height, width, stroke } = props;
  const svgCode = `
  <svg width=${width} height=${height} viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31 10C35.8847 17.3268 36.5574 21.5568 31 29.5" stroke="url(#paint0_linear_928_3537)" stroke-width="3" stroke-linecap="round">
                                    <animate attributeName="d" values="M31 10C35.8847 17.3268 36.5574 21.5568 31 29.5;M28 10C32.8847 17.3268 33.5574 21.5568 28 29.5;M31 10C35.8847 17.3268 36.5574 21.5568 31 29.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
<path d="M35 3C44.7814 16.0754 43.8743 23.2998 35 36" stroke="url(#paint1_linear_928_3537)" stroke-width="3" stroke-linecap="round">
                                    <animate attributeName="d" values="M35 3C44.7814 16.0754 43.8743 23.2998 35 36;M29 3C38.7814 16.0754 37.8743 23.2998 29 36;M35 3C44.7814 16.0754 43.8743 23.2998 35 36" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></path>
<path d="M28 2.64215V35.3558C28 37.6337 25.256 38.8412 23.52 37.3276L13.8449 28.8958C13.5492 28.6387 13.1676 28.4967 12.7723 28.4968H4.84615C4.20975 28.4968 3.57957 28.374 2.99161 28.1353C2.40365 27.8965 1.86941 27.5467 1.41941 27.1056C0.969399 26.6645 0.612434 26.1409 0.368892 25.5646C0.12535 24.9883 0 24.3706 0 23.7468V14.2511C0.00057107 12.9917 0.511399 11.7841 1.42017 10.8937C2.32894 10.0034 3.56125 9.50324 4.84615 9.50324H12.7723C13.1679 9.50277 13.5496 9.36005 13.8449 9.10213L23.5178 0.672496C25.256 -0.841164 28 0.366386 28 2.64215Z" fill="url(#paint2_linear_928_3537)"/>
<defs>
<linearGradient id="paint0_linear_928_3537" x1="32.9599" y1="10" x2="32.9599" y2="29.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#002BAD"/>
<stop offset="1" stop-color="#4263C7"/>

                                    
                                    <animate attributeName="x1" values="32.9599;30;32.9599" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="10;28;10" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="32.9599;25;32.9599" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="29.5;8;29.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
<linearGradient id="paint1_linear_928_3537" x1="38.5" y1="3" x2="38.5" y2="36" gradientUnits="userSpaceOnUse">
<stop stop-color="#002BAD"/>
<stop offset="1" stop-color="#4263C7"/>

                                    
                                    <animate attributeName="x1" values="38.5;36;38.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="3;29.5;3" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="38.5;27.5;38.5" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="36;7;36" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
<linearGradient id="paint2_linear_928_3537" x1="14" y1="1.31758e-07" x2="11" y2="26" gradientUnits="userSpaceOnUse">
<stop stop-color="#072FA8">
                                    <animate attributeName="stop-color" values="#072FA8;#062EA7;#072FA8" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></stop>
<stop offset="1" stop-color="#2549B7">
                                    <animate attributeName="offset" values="1;0.989378;1" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="stop-color" values="#2549B7;#4061C6;#2549B7" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></stop>

                                    
                                    <animate attributeName="x1" values="14;27;14" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y1" values="1.31758e-07;36;1.31758e-07" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="x2" values="11;23.5;11" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/>
                                    <animate attributeName="y2" values="26;5;26" begin="0s" dur="2s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;1"/></linearGradient>
</defs>
</svg>
    `;
  return <div dangerouslySetInnerHTML={{ __html: svgCode }} />;
};
