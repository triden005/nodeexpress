$(document).ready(()=>{
    $('.alert').alert()
    $('.delete-article').on("click",(e)=>{
        // 
        // var id1=e.target.attributes["data-id"].nodeValue;
        $target=$(e.target);
        const id=$target.attr('data-id');
        
        $.ajax({
            type:'DELETE',
            url : '/articles/'+id,
            success:(res)=>{
                alert('Deleting Article');

                window.location.href='/';
            },
            error:(err)=>{
                // console.log(err);
                alert("Something went wrong!!")
            }

        });
    });
});