<?php

namespace Drawing;

use Dompdf\Dompdf;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Twig\TwigFilter;

class DrawingToPDF
{
    public static function handle(Request $request)
    {
        $handle = $request->get('handle');
        if (!$handle) {
            return new Response();
        }

        return static::$handle($request);
    }

    /**
     * 将图转换为 PDF
     *
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function convert(Request $request)
    {
        $twig = static::getTwig();

        $drawing = $request->files->get('drawing');

        $context = $request->request->all();
        $context['drawing'] = str_replace('\\', '/', $drawing->getRealPath());

        $html = $twig->render('pdf.twig.html', $context);

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->getOptions()->setChroot($drawing->getPath());
        $dompdf->loadHtml($html);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4');

        // Render the HTML as PDF
        $dompdf->render();

        $uid = uniqid('', true);

        file_put_contents(static::getPDFPath($uid), $dompdf->output());

        // Output the generated PDF to Browser
        // $dompdf->stream('drawing.pdf');

        return new Response(json_encode(['uid'=>$uid]));
    }

    /**
     * @param  \Symfony\Component\HttpFoundation\Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected static function download(Request $request)
    {
        $pdf = static::getPDFPath($request->get('uid'));
        $content = file_get_contents($pdf);

        unlink($pdf);

        $response = new Response($content);

        $disposition = HeaderUtils::makeDisposition(
            HeaderUtils::DISPOSITION_ATTACHMENT,
            'drawing.pdf'
        );

        $response->headers->set('Content-Disposition', $disposition);

        return $response;
    }

    /**
     * @param  string $id
     * @return string
     */
    protected static function getPDFPath(string $id)
    {
        return ROOT.'/cache/'.$id.'.pdf';
    }

    /**
     * @return \Twig\Environment
     */
    protected static function getTwig()
    {
        $loader = new \Twig\Loader\FilesystemLoader('twigs', ROOT);
        $twig = new \Twig\Environment($loader);

        $twig->addFilter(new \Twig\TwigFilter('real_path', function($path) {
            $base = substr($path, 0, 1) === '/' ? $_SERVER['DOCUMENT_ROOT'] : ROOT.'/twigs';
            $realPath = realpath($base . '/' . ltrim($path, '\\/'));
            return str_replace('\\', '/', $realPath);
        }));

        return $twig;
    }
}
