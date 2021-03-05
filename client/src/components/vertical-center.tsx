export default function VerticalCenter({children}) {
    return (
        <div className="w-100 h-100 d-flex flex-column justify-content-center">
            {children}
        </div>
    )
}