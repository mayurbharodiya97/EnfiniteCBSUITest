import Typograhpy from "components/common/typograhpy"
import { Accountinquiry, AccountinquiryCommonComp } from "pages_audit/acct_Inquiry/acct_inquiry"
import { useState } from "react"

const AcctMST = () => {
    const [open, setOpen] = useState(true)
    const onClose = () => {
        setOpen(false)
    }
    return (
        <>
            <h3>Account Opening</h3>
            {/* <AccountinquiryCommonComp /> */}
        </>
    )
}

export default AcctMST;