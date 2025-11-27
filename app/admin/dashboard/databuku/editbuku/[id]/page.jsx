import { getBookById } from "@/app/lib/actions"

export default async function EditBukuPage({params}) {
    const { id } = await params

    const buku = await getBookById(id)

    return(
        <form>
            
        </form>
    )
}