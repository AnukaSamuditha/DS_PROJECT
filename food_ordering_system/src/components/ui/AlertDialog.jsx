import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


export default function AlertDialogPopup({isOpen,handlePopupOpen,order, onAccept, onReject,title,deny,accept,children}) {
  const handleOnAccept = ()=>{
    onAccept();
    handlePopupOpen();
  }

  const handleOnReject = ()=>{
    onReject();
    handlePopupOpen();
  }
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title && title}</AlertDialogTitle>
          <AlertDialogDescription>
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleOnReject}>{deny && deny}</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnAccept}>{accept && accept}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
