import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   if(!value) return null;
  //   if(!args) return value;

  //   args=args.toLowerCase();
  //   return value.filter(function(item:any){
  //     return JSON.stringify(item).toLocaleLowerCase().includes(args);
  //   })
  // }

  transform(value: any, ...args: any[]): any {
    if (!value) return null;
    if (!args || args.length === 0) return value;
  
    const search = typeof args[0] === 'string' ? args[0].toLowerCase() : '';
  
    return value.filter((item: any) => {
      return JSON.stringify(item).toLocaleLowerCase().includes(search);
    });
  }
  

}
