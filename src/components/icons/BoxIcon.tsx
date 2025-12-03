import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    className?: string;
}

export const BoxIcon: React.FC<IconProps> = ({ size = 24, className, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="currentColor"
        {...props}
    >
        <path d="M2 18.66l10.5 4.313L23 18.661V6.444L12.5 2.13 2 6.444zm20-.67l-9 3.697V11.102l9-3.68zM12.5 3.213l8.557 3.514-8.557 3.5-8.557-3.5zM3 7.422l9 3.68v10.585L3 17.99z" />
    </svg>
);
