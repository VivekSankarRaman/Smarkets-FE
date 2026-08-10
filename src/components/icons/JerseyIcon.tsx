import SvgIcon from "@mui/material/SvgIcon";
import type { SvgIconProps } from "@mui/material/SvgIcon";

export function JerseyIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M8.5 2 4 5.5v4l2-1V21h12V8.5l2 1v-4L15.5 2h-2a1.5 1.5 0 0 1-3 0z" />
    </SvgIcon>
  );
}
