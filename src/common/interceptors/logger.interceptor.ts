import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`Método: ${method} - URL: ${url} - Tempo: ${now}ms`);
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(`Método: ${method} - URL: ${url} - Tempo de Resposta: ${responseTime}ms`);
      })
    );
  }
}