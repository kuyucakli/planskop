/*
Material Icons -> https://fonts.google.com/icons
*/

const IconSvgBase = ({ children, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    {...props}
  >
    {children}
  </svg>
);

const IconAdd = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </IconSvgBase>
);

const IconAddPhotoAlternate = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
  </IconSvgBase>
);

const IconAttachFile = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M693.85-338.46q0 90.88-62.62 154.67Q568.62-120 478.08-120t-153.54-63.79q-63-63.79-63-154.67v-349.23q0-63.46 43.65-107.89Q348.85-840 412.31-840q63.46 0 107.11 44.42 43.66 44.43 43.66 107.89v330.77q0 35.23-24.59 60.69-24.58 25.46-59.92 25.46t-60.8-25.06q-25.46-25.06-25.46-61.09v-332.31h40v332.31q0 19.15 13.11 32.65 13.12 13.5 32.27 13.5 19.16 0 32.27-13.5 13.12-13.5 13.12-32.65v-331.54q-.23-46.62-32.06-79.08Q459.2-800 412.31-800q-46.53 0-78.65 32.85-32.12 32.84-32.12 79.46v349.23q-.23 74.08 51.31 126.27Q404.38-160 478.36-160q72.92 0 123.97-52.19t51.52-126.27v-350.77h40v350.77Z" />
  </IconSvgBase>
);
const IconArrowHistoryBack = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
  </IconSvgBase>
);
const IconArrowBack = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M640-93.85 253.85-480 640-866.15l56.77 56.77L367.38-480l329.39 329.38L640-93.85Z" />
  </IconSvgBase>
);
const IconArrowForward = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m320.62-93.85-56.77-56.77L593.23-480 263.85-809.38l56.77-56.77L706.77-480 320.62-93.85Z" />
  </IconSvgBase>
);
const IconCancel = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </IconSvgBase>
);

const IconClose = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m338-288-50-50 141-142-141-141 50-50 142 141 141-141 50 50-141 141 141 142-50 50-141-141-142 141Z" />
  </IconSvgBase>
);

const IconHome = ({ fill = "e8eaed" }) => (
  <IconSvgBase fill={fill}>
    <path d="M252-212h85v-251h286v251h85v-342L480-725 252-554v342ZM126-86v-531l354-266 354 265.67V-86H512v-266h-64v266H126Zm354-382Z" />
  </IconSvgBase>
);

const IconInfo = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
    />
  </IconSvgBase>
);

const IconUserCircle = () => (
  <IconSvgBase>
    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
  </IconSvgBase>
);

const IconLogout = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
  </IconSvgBase>
);
const IconLogin = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
  </IconSvgBase>
);

const IconEdit = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
  </IconSvgBase>
);

const IconDelete = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  </IconSvgBase>
);

const IconSave = () => (
  <IconSvgBase>
    <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
  </IconSvgBase>
);

const IconUpload = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M460-344.62h40.77v-196.46l84 84 27.54-27.54-131.54-131.53-132.31 131.53L376-457.08l84-84v196.46ZM480.13-120q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </IconSvgBase>
);

const IconCheck = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M382-253.85 168.62-467.23 211.38-510 382-339.38 748.62-706l42.76 42.77L382-253.85Z" />
  </IconSvgBase>
);

const IconCircle = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </IconSvgBase>
);

const IconCheckCircle = ({ ...props }) => (
  <IconSvgBase {...props}>
    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </IconSvgBase>
);

const IconSchedule = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m618.92-298.92 42.16-42.16L510-492.16V-680h-60v212.15l168.92 168.93ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100ZM480-480Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
  </IconSvgBase>
);

const IconSettings = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <IconSvgBase {...props}>
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
  </IconSvgBase>
);

export {
  IconAdd,
  IconAddPhotoAlternate,
  IconArrowBack,
  IconArrowForward,
  IconArrowHistoryBack,
  IconAttachFile,
  IconSettings,
  IconHome,
  IconLogout,
  IconLogin,
  IconEdit,
  IconCheck,
  IconCircle,
  IconCheckCircle,
  IconDelete,
  IconSave,
  IconCancel,
  IconInfo,
  IconSchedule,
  IconClose,
  IconUpload,
  IconUserCircle,
};
