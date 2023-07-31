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