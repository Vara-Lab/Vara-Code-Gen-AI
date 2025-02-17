interface Props {
    label: string;
}

export const Option = ({ label }: Props) => {
    return (
        <p>{label}</p>
    );
};